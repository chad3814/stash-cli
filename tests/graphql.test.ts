import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import test from 'node:test';
import { gql, request } from '../src/graphql.js';

type CapturedRequest = {
  method: string;
  contentType: string | undefined;
  accept: string | undefined;
  body: string;
};

type StubReply = {
  status?: number;
  body: string;
};

type Stub = {
  url: string;
  requests: CapturedRequest[];
  close: () => Promise<void>;
};

async function startStub(reply: StubReply): Promise<Stub> {
  const requests: CapturedRequest[] = [];
  const server = createServer((req, res) => {
    let body = '';
    req.on('data', (chunk: Buffer) => {
      body += chunk.toString('utf8');
    });
    req.on('end', () => {
      requests.push({
        method: req.method ?? '',
        contentType: req.headers['content-type'],
        accept: req.headers['accept'],
        body,
      });
      res.writeHead(reply.status ?? 200, { 'content-type': 'application/json' });
      res.end(reply.body);
    });
  });

  await new Promise<void>((resolveListen) => {
    server.listen(0, '127.0.0.1', resolveListen);
  });

  const address = server.address();
  if (address === null || typeof address === 'string') {
    throw new Error('stub server did not bind a port');
  }

  return {
    url: `http://127.0.0.1:${address.port}/graphql`,
    requests,
    close: () =>
      new Promise<void>((resolveClose, rejectClose) => {
        server.close((err) => {
          if (err) {
            rejectClose(err);
            return;
          }
          resolveClose();
        });
      }),
  };
}

test('gql concatenates the template and its interpolations', () => {
  const fragment = 'progress';
  assert.equal(gql`{ jobQueue { ${fragment} } }`, '{ jobQueue { progress } }');
});

test('gql returns a plain template unchanged', () => {
  assert.equal(gql`query { ok }`, 'query { ok }');
});

test('request posts the query as JSON with the graphql accept header', async () => {
  const stub = await startStub({ body: JSON.stringify({ data: { ok: true } }) });
  try {
    await request(stub.url, 'query { ok }');

    const sent = stub.requests[0];
    assert.ok(sent, 'no request reached the server');
    assert.equal(sent.method, 'POST');
    assert.equal(sent.contentType, 'application/json');
    assert.equal(sent.accept, 'application/graphql-response+json, application/json');
  } finally {
    await stub.close();
  }
});

test('request sends only a query field, never an operation name', async () => {
  const stub = await startStub({ body: JSON.stringify({ data: { ok: true } }) });
  try {
    await request(stub.url, 'query { ok }');

    const sent = stub.requests[0];
    assert.ok(sent, 'no request reached the server');
    assert.deepEqual(Object.keys(JSON.parse(sent.body)), ['query']);
    assert.deepEqual(JSON.parse(sent.body), { query: 'query { ok }' });
  } finally {
    await stub.close();
  }
});

test('request returns the data field', async () => {
  const stub = await startStub({ body: JSON.stringify({ data: { jobQueue: [{ id: '7' }] } }) });
  try {
    const data = await request<{ jobQueue: { id: string }[] }>(stub.url, 'query { jobQueue { id } }');
    assert.deepEqual(data, { jobQueue: [{ id: '7' }] });
  } finally {
    await stub.close();
  }
});

test('request throws the server message when the response carries graphql errors', async () => {
  const stub = await startStub({
    body: JSON.stringify({ errors: [{ message: 'boom from server' }] }),
  });
  try {
    await assert.rejects(
      request(stub.url, 'query { ok }'),
      (err: Error) => {
        assert.match(err.message, /boom from server/);
        return true;
      },
    );
  } finally {
    await stub.close();
  }
});

test('request joins multiple graphql error messages', async () => {
  const stub = await startStub({
    body: JSON.stringify({ errors: [{ message: 'first' }, { message: 'second' }] }),
  });
  try {
    await assert.rejects(request(stub.url, 'query { ok }'), (err: Error) => {
      assert.match(err.message, /first/);
      assert.match(err.message, /second/);
      return true;
    });
  } finally {
    await stub.close();
  }
});

test('request throws on a non-2xx status and includes it', async () => {
  const stub = await startStub({ status: 500, body: 'upstream exploded' });
  try {
    await assert.rejects(request(stub.url, 'query { ok }'), (err: Error) => {
      assert.match(err.message, /500/);
      assert.match(err.message, /upstream exploded/);
      return true;
    });
  } finally {
    await stub.close();
  }
});

test('request throws when the response has no data field', async () => {
  const stub = await startStub({ body: JSON.stringify({ extensions: {} }) });
  try {
    await assert.rejects(request(stub.url, 'query { ok }'), (err: Error) => {
      assert.match(err.message, /no data/i);
      return true;
    });
  } finally {
    await stub.close();
  }
});

test('request throws when the response body is not json', async () => {
  const stub = await startStub({ body: '<html>nope</html>' });
  try {
    await assert.rejects(request(stub.url, 'query { ok }'), (err: Error) => {
      assert.match(err.message, /json/i);
      return true;
    });
  } finally {
    await stub.close();
  }
});
