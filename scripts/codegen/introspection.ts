export type TypeKind =
  | 'SCALAR'
  | 'OBJECT'
  | 'INTERFACE'
  | 'UNION'
  | 'ENUM'
  | 'INPUT_OBJECT'
  | 'LIST'
  | 'NON_NULL';

export type TypeRef = {
  kind: TypeKind;
  name: string | null;
  ofType?: TypeRef | null;
};

export type IntrospectionInputValue = {
  name: string;
  description?: string | null;
  defaultValue?: string | null;
  type: TypeRef;
};

export type IntrospectionField = {
  name: string;
  description?: string | null;
  isDeprecated?: boolean;
  deprecationReason?: string | null;
  args?: IntrospectionInputValue[];
  type: TypeRef;
};

export type IntrospectionEnumValue = {
  name: string;
  description?: string | null;
  isDeprecated?: boolean;
  deprecationReason?: string | null;
};

export type IntrospectionType = {
  kind: TypeKind;
  name: string;
  description?: string | null;
  fields?: IntrospectionField[] | null;
  inputFields?: IntrospectionInputValue[] | null;
  enumValues?: IntrospectionEnumValue[] | null;
  possibleTypes?: TypeRef[] | null;
};

export type IntrospectionSchema = {
  queryType: { name: string } | null;
  mutationType: { name: string } | null;
  subscriptionType: { name: string } | null;
  types: IntrospectionType[];
};

export const INTROSPECTION_QUERY = `
query {
  __schema {
    queryType { name }
    mutationType { name }
    subscriptionType { name }
    types {
      kind
      name
      description
      fields(includeDeprecated: true) {
        name
        description
        isDeprecated
        deprecationReason
        args { ...InputValue }
        type { ...TypeRef }
      }
      inputFields { ...InputValue }
      enumValues(includeDeprecated: true) {
        name
        description
        isDeprecated
        deprecationReason
      }
      possibleTypes { ...TypeRef }
    }
  }
}

fragment InputValue on __InputValue {
  name
  description
  defaultValue
  type { ...TypeRef }
}

fragment TypeRef on __Type {
  kind
  name
  ofType { kind name
    ofType { kind name
      ofType { kind name
        ofType { kind name
          ofType { kind name
            ofType { kind name
              ofType { kind name }
            }
          }
        }
      }
    }
  }
}
`;
