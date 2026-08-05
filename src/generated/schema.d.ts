/**
 * Generated from the stash GraphQL schema. Do not edit.
 *
 * Regenerate with: npm run codegen
 */

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export type AddTempDLNAIPInput = {
  address: string;
  /** Duration to enable, in minutes. 0 or null for indefinite. */
  duration?: number | null;
};

export type AnonymiseDatabaseInput = {
  download?: boolean | null;
};

export type AssignSceneFileInput = {
  scene_id: string;
  file_id: string;
};

export type AutoTagMetadataInput = {
  /** Paths to tag, null for all files */
  paths?: string[] | null;
  /** IDs of performers to tag files with, or "*" for all */
  performers?: string[] | null;
  /** IDs of studios to tag files with, or "*" for all */
  studios?: string[] | null;
  /** IDs of tags to tag files with, or "*" for all */
  tags?: string[] | null;
};

export type AutoTagMetadataOptions = {
  /** IDs of performers to tag files with, or "*" for all */
  performers: string[] | null;
  /** IDs of studios to tag files with, or "*" for all */
  studios: string[] | null;
  /** IDs of tags to tag files with, or "*" for all */
  tags: string[] | null;
};

export type BackupDatabaseInput = {
  download?: boolean | null;
  /** If true, blob files will be included in the backup. This can significantly increase the size of the backup and the time it takes to create it, but allows for a complete backup of the system that can be restored without needing access to the original media files. */
  includeBlobs?: boolean | null;
};

export type BaseFile = {
  id: string;
  path: string;
  basename: string;
  /** @deprecated Use parent_folder instead */
  parent_folder_id: string;
  /** @deprecated Use zip_file instead */
  zip_file_id: string | null;
  parent_folder: Folder;
  zip_file: BasicFile | null;
  mod_time: string;
  size: number;
  fingerprint: string | null;
  fingerprints: Fingerprint[];
  created_at: string;
  updated_at: string;
};

export type BasicFile = {
  id: string;
  path: string;
  basename: string;
  /** @deprecated Use parent_folder instead */
  parent_folder_id: string;
  /** @deprecated Use zip_file instead */
  zip_file_id: string | null;
  parent_folder: Folder;
  zip_file: BasicFile | null;
  mod_time: string;
  size: number;
  fingerprint: string | null;
  fingerprints: Fingerprint[];
  created_at: string;
  updated_at: string;
};

export type BlobsStorageType =
  /** Database */
  | 'DATABASE'
  /** Filesystem */
  | 'FILESYSTEM';

export type BulkGalleryUpdateInput = {
  clientMutationId?: string | null;
  ids?: string[] | null;
  code?: string | null;
  /** @deprecated Use urls */
  url?: string | null;
  urls?: BulkUpdateStrings | null;
  date?: string | null;
  details?: string | null;
  photographer?: string | null;
  rating100?: number | null;
  organized?: boolean | null;
  scene_ids?: BulkUpdateIds | null;
  studio_id?: string | null;
  tag_ids?: BulkUpdateIds | null;
  performer_ids?: BulkUpdateIds | null;
  custom_fields?: CustomFieldsInput | null;
};

export type BulkGroupUpdateInput = {
  clientMutationId?: string | null;
  ids?: string[] | null;
  rating100?: number | null;
  date?: string | null;
  synopsis?: string | null;
  studio_id?: string | null;
  director?: string | null;
  urls?: BulkUpdateStrings | null;
  tag_ids?: BulkUpdateIds | null;
  containing_groups?: BulkUpdateGroupDescriptionsInput | null;
  sub_groups?: BulkUpdateGroupDescriptionsInput | null;
  custom_fields?: CustomFieldsInput | null;
};

export type BulkImageUpdateInput = {
  clientMutationId?: string | null;
  ids?: string[] | null;
  title?: string | null;
  code?: string | null;
  rating100?: number | null;
  organized?: boolean | null;
  /** @deprecated Use urls */
  url?: string | null;
  urls?: BulkUpdateStrings | null;
  date?: string | null;
  details?: string | null;
  photographer?: string | null;
  studio_id?: string | null;
  performer_ids?: BulkUpdateIds | null;
  tag_ids?: BulkUpdateIds | null;
  gallery_ids?: BulkUpdateIds | null;
  custom_fields?: CustomFieldsInput | null;
};

export type BulkMovieUpdateInput = {
  clientMutationId?: string | null;
  ids?: string[] | null;
  rating100?: number | null;
  studio_id?: string | null;
  director?: string | null;
  urls?: BulkUpdateStrings | null;
  tag_ids?: BulkUpdateIds | null;
};

export type BulkPerformerUpdateInput = {
  clientMutationId?: string | null;
  ids?: string[] | null;
  disambiguation?: string | null;
  /** @deprecated Use urls */
  url?: string | null;
  urls?: BulkUpdateStrings | null;
  gender?: GenderEnum | null;
  birthdate?: string | null;
  ethnicity?: string | null;
  country?: string | null;
  eye_color?: string | null;
  height_cm?: number | null;
  measurements?: string | null;
  fake_tits?: string | null;
  penis_length?: number | null;
  circumcised?: CircumcisedEnum | null;
  /** @deprecated Use career_start and career_end */
  career_length?: string | null;
  career_start?: string | null;
  career_end?: string | null;
  tattoos?: string | null;
  piercings?: string | null;
  /** Duplicate aliases and those equal to name will result in an error (case-insensitive) */
  alias_list?: BulkUpdateStrings | null;
  /** @deprecated Use urls */
  twitter?: string | null;
  /** @deprecated Use urls */
  instagram?: string | null;
  favorite?: boolean | null;
  tag_ids?: BulkUpdateIds | null;
  rating100?: number | null;
  details?: string | null;
  death_date?: string | null;
  hair_color?: string | null;
  weight?: number | null;
  ignore_auto_tag?: boolean | null;
  custom_fields?: CustomFieldsInput | null;
};

export type BulkSceneMarkerUpdateInput = {
  ids?: string[] | null;
  title?: string | null;
  primary_tag_id?: string | null;
  tag_ids?: BulkUpdateIds | null;
};

export type BulkSceneUpdateInput = {
  clientMutationId?: string | null;
  ids?: string[] | null;
  title?: string | null;
  code?: string | null;
  details?: string | null;
  director?: string | null;
  /** @deprecated Use urls */
  url?: string | null;
  urls?: BulkUpdateStrings | null;
  date?: string | null;
  rating100?: number | null;
  organized?: boolean | null;
  studio_id?: string | null;
  gallery_ids?: BulkUpdateIds | null;
  performer_ids?: BulkUpdateIds | null;
  tag_ids?: BulkUpdateIds | null;
  group_ids?: BulkUpdateIds | null;
  /** @deprecated Use group_ids */
  movie_ids?: BulkUpdateIds | null;
  custom_fields?: CustomFieldsInput | null;
};

export type BulkStudioUpdateInput = {
  ids: string[];
  /** @deprecated Use urls */
  url?: string | null;
  urls?: BulkUpdateStrings | null;
  parent_id?: string | null;
  rating100?: number | null;
  favorite?: boolean | null;
  details?: string | null;
  tag_ids?: BulkUpdateIds | null;
  ignore_auto_tag?: boolean | null;
  organized?: boolean | null;
};

export type BulkTagUpdateInput = {
  ids?: string[] | null;
  description?: string | null;
  /** Duplicate aliases and those equal to name will result in an error (case-insensitive) */
  aliases?: BulkUpdateStrings | null;
  ignore_auto_tag?: boolean | null;
  favorite?: boolean | null;
  parent_ids?: BulkUpdateIds | null;
  child_ids?: BulkUpdateIds | null;
};

export type BulkUpdateGroupDescriptionsInput = {
  groups: GroupDescriptionInput[];
  mode: BulkUpdateIdMode;
};

export type BulkUpdateIdMode =
  | 'SET'
  | 'ADD'
  | 'REMOVE';

export type BulkUpdateIds = {
  ids?: string[] | null;
  mode: BulkUpdateIdMode;
};

export type BulkUpdateStrings = {
  values?: string[] | null;
  mode: BulkUpdateIdMode;
};

export type CircumcisedEnum =
  | 'CUT'
  | 'UNCUT';

export type CircumcisionCriterionInput = {
  value?: CircumcisedEnum[] | null;
  modifier: CriterionModifier;
};

export type CleanGeneratedInput = {
  /** Clean blob files without blob entries */
  blobFiles?: boolean | null;
  /** Clean sprite and vtt files without scene entries */
  sprites?: boolean | null;
  /** Clean preview files without scene entries */
  screenshots?: boolean | null;
  /** Clean scene transcodes without scene entries */
  transcodes?: boolean | null;
  /** Clean marker files without marker entries */
  markers?: boolean | null;
  /** Clean image thumbnails/clips without image entries */
  imageThumbnails?: boolean | null;
  /** Do a dry run. Don't delete any files */
  dryRun?: boolean | null;
};

export type CleanMetadataInput = {
  paths?: string[] | null;
  /**
   * Don't check zip file contents when determining whether to clean a file.
   * This can significantly speed up the clean process, but will potentially miss removed files within zip files.
   * Where users do not modify zip files contents directly, this should be safe to use.
   * Defaults to false.
   */
  ignoreZipFileContents?: boolean | null;
  /** Do a dry run. Don't delete any files */
  dryRun: boolean;
};

export type ConfigDLNAInput = {
  serverName?: string | null;
  /** True if DLNA service should be enabled by default */
  enabled?: boolean | null;
  /** Defaults to 1338 */
  port?: number | null;
  /** List of IPs whitelisted for DLNA service */
  whitelistedIPs?: string[] | null;
  /** List of interfaces to run DLNA on. Empty for all */
  interfaces?: string[] | null;
  /** Order to sort videos */
  videoSortOrder?: string | null;
};

export type ConfigDLNAResult = {
  serverName: string;
  /** True if DLNA service should be enabled by default */
  enabled: boolean;
  /** Defaults to 1338 */
  port: number;
  /** List of IPs whitelisted for DLNA service */
  whitelistedIPs: string[];
  /** List of interfaces to run DLNA on. Empty for all */
  interfaces: string[];
  /** Order to sort videos */
  videoSortOrder: string;
};

export type ConfigDefaultSettingsInput = {
  scan?: ScanMetadataInput | null;
  identify?: IdentifyMetadataInput | null;
  autoTag?: AutoTagMetadataInput | null;
  generate?: GenerateMetadataInput | null;
  /** If true, delete file checkbox will be checked by default */
  deleteFile?: boolean | null;
  /** If true, delete generated files checkbox will be checked by default */
  deleteGenerated?: boolean | null;
};

export type ConfigDefaultSettingsResult = {
  scan: ScanMetadataOptions | null;
  identify: IdentifyMetadataTaskOptions | null;
  autoTag: AutoTagMetadataOptions | null;
  generate: GenerateMetadataOptions | null;
  /** If true, delete file checkbox will be checked by default */
  deleteFile: boolean | null;
  /** If true, delete generated supporting files checkbox will be checked by default */
  deleteGenerated: boolean | null;
};

export type ConfigDisableDropdownCreate = {
  performer: boolean;
  tag: boolean;
  studio: boolean;
  movie: boolean;
  gallery: boolean;
};

export type ConfigDisableDropdownCreateInput = {
  performer?: boolean | null;
  tag?: boolean | null;
  studio?: boolean | null;
  movie?: boolean | null;
  gallery?: boolean | null;
};

export type ConfigGeneralInput = {
  /** Array of file paths to content */
  stashes?: StashConfigInput[] | null;
  /** Path to the SQLite database */
  databasePath?: string | null;
  /** Path to backup directory */
  backupDirectoryPath?: string | null;
  /** Path to trash directory - if set, deleted files will be moved here instead of being permanently deleted */
  deleteTrashPath?: string | null;
  /** Path to generated files */
  generatedPath?: string | null;
  /** Path to import/export files */
  metadataPath?: string | null;
  /** Path to scrapers */
  scrapersPath?: string | null;
  /** Path to plugins */
  pluginsPath?: string | null;
  /** Path to cache */
  cachePath?: string | null;
  /** Path to blobs - required for filesystem blob storage */
  blobsPath?: string | null;
  /** Where to store blobs */
  blobsStorage?: BlobsStorageType | null;
  /** Path to the ffmpeg binary. If empty, stash will attempt to find it in the path or config directory */
  ffmpegPath?: string | null;
  /** Path to the ffprobe binary. If empty, stash will attempt to find it in the path or config directory */
  ffprobePath?: string | null;
  /** Whether to calculate MD5 checksums for scene video files */
  calculateMD5?: boolean | null;
  /** Hash algorithm to use for generated file naming */
  videoFileNamingAlgorithm?: HashAlgorithm | null;
  /** Number of parallel tasks to start during scan/generate */
  parallelTasks?: number | null;
  /** Include audio stream in previews */
  previewAudio?: boolean | null;
  /** Number of segments in a preview file */
  previewSegments?: number | null;
  /** Preview segment duration, in seconds */
  previewSegmentDuration?: number | null;
  /** Duration of start of video to exclude when generating previews */
  previewExcludeStart?: string | null;
  /** Duration of end of video to exclude when generating previews */
  previewExcludeEnd?: string | null;
  /** Preset when generating preview */
  previewPreset?: PreviewPreset | null;
  /** Transcode Hardware Acceleration */
  transcodeHardwareAcceleration?: boolean | null;
  /** Max generated transcode size */
  maxTranscodeSize?: StreamingResolutionEnum | null;
  /** Max streaming transcode size */
  maxStreamingTranscodeSize?: StreamingResolutionEnum | null;
  /**
   * ffmpeg transcode input args - injected before input file
   * These are applied to generated transcodes (previews and transcodes)
   */
  transcodeInputArgs?: string[] | null;
  /**
   * ffmpeg transcode output args - injected before output file
   * These are applied to generated transcodes (previews and transcodes)
   */
  transcodeOutputArgs?: string[] | null;
  /**
   * ffmpeg stream input args - injected before input file
   * These are applied when live transcoding
   */
  liveTranscodeInputArgs?: string[] | null;
  /**
   * ffmpeg stream output args - injected before output file
   * These are applied when live transcoding
   */
  liveTranscodeOutputArgs?: string[] | null;
  /** whether to include range in generated funscript heatmaps */
  drawFunscriptHeatmapRange?: boolean | null;
  /** Write image thumbnails to disk when generating on the fly */
  writeImageThumbnails?: boolean | null;
  /** Create Image Clips from Video extensions when Videos are disabled in Library */
  createImageClipsFromVideos?: boolean | null;
  /** Username */
  username?: string | null;
  /** Password */
  password?: string | null;
  /** Maximum session cookie age */
  maxSessionAge?: number | null;
  /** Name of the log file */
  logFile?: string | null;
  /** Whether to also output to stderr */
  logOut?: boolean | null;
  /** Minimum log level */
  logLevel?: string | null;
  /** Whether to log http access */
  logAccess?: boolean | null;
  /** Maximum log size */
  logFileMaxSize?: number | null;
  /** True if galleries should be created from folders with images */
  createGalleriesFromFolders?: boolean | null;
  /** Regex used to identify images as gallery covers */
  galleryCoverRegex?: string | null;
  /** Array of video file extensions */
  videoExtensions?: string[] | null;
  /** Array of image file extensions */
  imageExtensions?: string[] | null;
  /** Array of gallery zip file extensions */
  galleryExtensions?: string[] | null;
  /** Array of file regexp to exclude from Video Scans */
  excludes?: string[] | null;
  /** Array of file regexp to exclude from Image Scans */
  imageExcludes?: string[] | null;
  /** Custom Performer Image Location */
  customPerformerImageLocation?: string | null;
  /** Stash-box instances used for tagging */
  stashBoxes?: StashBoxInput[] | null;
  /** Python path - resolved using path if unset */
  pythonPath?: string | null;
  /** Source of scraper packages */
  scraperPackageSources?: PackageSourceInput[] | null;
  /** Source of plugin packages */
  pluginPackageSources?: PackageSourceInput[] | null;
  /** Size of the longest dimension for each sprite in pixels */
  spriteScreenshotSize?: number | null;
  /** True if sprite generation should use the sprite interval and min/max sprites settings instead of the default */
  useCustomSpriteInterval?: boolean | null;
  /** Time between two different scrubber sprites in seconds - only used if useCustomSpriteInterval is true */
  spriteInterval?: number | null;
  /** Minimum number of sprites to be generated - only used if useCustomSpriteInterval is true */
  minimumSprites?: number | null;
  /** Minimum number of sprites to be generated - only used if useCustomSpriteInterval is true */
  maximumSprites?: number | null;
};

export type ConfigGeneralResult = {
  /** Array of file paths to content */
  stashes: StashConfig[];
  /** Path to the SQLite database */
  databasePath: string;
  /** Path to backup directory */
  backupDirectoryPath: string;
  /** Path to trash directory - if set, deleted files will be moved here instead of being permanently deleted */
  deleteTrashPath: string;
  /** Path to generated files */
  generatedPath: string;
  /** Path to import/export files */
  metadataPath: string;
  /** Path to the config file used */
  configFilePath: string;
  /** Path to scrapers */
  scrapersPath: string;
  /** Path to plugins */
  pluginsPath: string;
  /** Path to cache */
  cachePath: string;
  /** Path to blobs - required for filesystem blob storage */
  blobsPath: string;
  /** Where to store blobs */
  blobsStorage: BlobsStorageType;
  /** Path to the ffmpeg binary. If empty, stash will attempt to find it in the path or config directory */
  ffmpegPath: string;
  /** Path to the ffprobe binary. If empty, stash will attempt to find it in the path or config directory */
  ffprobePath: string;
  /** Whether to calculate MD5 checksums for scene video files */
  calculateMD5: boolean;
  /** Hash algorithm to use for generated file naming */
  videoFileNamingAlgorithm: HashAlgorithm;
  /** Number of parallel tasks to start during scan/generate */
  parallelTasks: number;
  /** Include audio stream in previews */
  previewAudio: boolean;
  /** Number of segments in a preview file */
  previewSegments: number;
  /** Preview segment duration, in seconds */
  previewSegmentDuration: number;
  /** Duration of start of video to exclude when generating previews */
  previewExcludeStart: string;
  /** Duration of end of video to exclude when generating previews */
  previewExcludeEnd: string;
  /** Preset when generating preview */
  previewPreset: PreviewPreset;
  /** Transcode Hardware Acceleration */
  transcodeHardwareAcceleration: boolean;
  /** Max generated transcode size */
  maxTranscodeSize: StreamingResolutionEnum | null;
  /** Max streaming transcode size */
  maxStreamingTranscodeSize: StreamingResolutionEnum | null;
  /**
   * ffmpeg transcode input args - injected before input file
   * These are applied to generated transcodes (previews and transcodes)
   */
  transcodeInputArgs: string[];
  /**
   * ffmpeg transcode output args - injected before output file
   * These are applied to generated transcodes (previews and transcodes)
   */
  transcodeOutputArgs: string[];
  /**
   * ffmpeg stream input args - injected before input file
   * These are applied when live transcoding
   */
  liveTranscodeInputArgs: string[];
  /**
   * ffmpeg stream output args - injected before output file
   * These are applied when live transcoding
   */
  liveTranscodeOutputArgs: string[];
  /** whether to include range in generated funscript heatmaps */
  drawFunscriptHeatmapRange: boolean;
  /** Write image thumbnails to disk when generating on the fly */
  writeImageThumbnails: boolean;
  /** Create Image Clips from Video extensions when Videos are disabled in Library */
  createImageClipsFromVideos: boolean;
  /** API Key */
  apiKey: string;
  /** Username */
  username: string;
  /** Password */
  password: string;
  /** Maximum session cookie age */
  maxSessionAge: number;
  /** Name of the log file */
  logFile: string | null;
  /** Whether to also output to stderr */
  logOut: boolean;
  /** Minimum log level */
  logLevel: string;
  /** Whether to log http access */
  logAccess: boolean;
  /** Maximum log size */
  logFileMaxSize: number;
  /** True if sprite generation should use the sprite interval and min/max sprites settings instead of the default */
  useCustomSpriteInterval: boolean;
  /** Time between two different scrubber sprites in seconds - only used if useCustomSpriteInterval is true */
  spriteInterval: number;
  /** Minimum number of sprites to be generated - only used if useCustomSpriteInterval is true */
  minimumSprites: number;
  /** Maximum number of sprites to be generated - only used if useCustomSpriteInterval is true */
  maximumSprites: number;
  /** Size of the longest dimension for each sprite in pixels */
  spriteScreenshotSize: number;
  /** Array of video file extensions */
  videoExtensions: string[];
  /** Array of image file extensions */
  imageExtensions: string[];
  /** Array of gallery zip file extensions */
  galleryExtensions: string[];
  /** True if galleries should be created from folders with images */
  createGalleriesFromFolders: boolean;
  /** Regex used to identify images as gallery covers */
  galleryCoverRegex: string;
  /** Array of file regexp to exclude from Video Scans */
  excludes: string[];
  /** Array of file regexp to exclude from Image Scans */
  imageExcludes: string[];
  /** Custom Performer Image Location */
  customPerformerImageLocation: string | null;
  /** Stash-box instances used for tagging */
  stashBoxes: StashBox[];
  /** Python path - resolved using path if unset */
  pythonPath: string;
  /** Source of scraper packages */
  scraperPackageSources: PackageSource[];
  /** Source of plugin packages */
  pluginPackageSources: PackageSource[];
};

export type ConfigImageLightboxInput = {
  slideshowDelay?: number | null;
  displayMode?: ImageLightboxDisplayMode | null;
  scaleUp?: boolean | null;
  resetZoomOnNav?: boolean | null;
  scrollMode?: ImageLightboxScrollMode | null;
  scrollAttemptsBeforeChange?: number | null;
  disableAnimation?: boolean | null;
};

export type ConfigImageLightboxResult = {
  slideshowDelay: number | null;
  displayMode: ImageLightboxDisplayMode | null;
  scaleUp: boolean | null;
  resetZoomOnNav: boolean | null;
  scrollMode: ImageLightboxScrollMode | null;
  scrollAttemptsBeforeChange: number;
  disableAnimation: boolean | null;
};

export type ConfigInterfaceInput = {
  /** True if SFW content mode is enabled */
  sfwContentMode?: boolean | null;
  /** Ordered list of items that should be shown in the menu */
  menuItems?: string[] | null;
  /** Enable sound on mouseover previews */
  soundOnPreview?: boolean | null;
  /** Show title and tags in wall view */
  wallShowTitle?: boolean | null;
  /** Wall playback type */
  wallPlayback?: string | null;
  /** Show scene scrubber by default */
  showScrubber?: boolean | null;
  /** Maximum duration (in seconds) in which a scene video will loop in the scene player */
  maximumLoopDuration?: number | null;
  /** If true, video will autostart on load in the scene player */
  autostartVideo?: boolean | null;
  /** If true, video will autostart when loading from play random or play selected */
  autostartVideoOnPlaySelected?: boolean | null;
  /** If true, next scene in playlist will be played at video end by default */
  continuePlaylistDefault?: boolean | null;
  /** If true, studio overlays will be shown as text instead of logo images */
  showStudioAsText?: boolean | null;
  /** Custom CSS */
  css?: string | null;
  cssEnabled?: boolean | null;
  /** Custom Javascript */
  javascript?: string | null;
  javascriptEnabled?: boolean | null;
  /** Custom Locales */
  customLocales?: string | null;
  customLocalesEnabled?: boolean | null;
  /** When true, disables all customizations (plugins, CSS, JavaScript, locales) for troubleshooting */
  disableCustomizations?: boolean | null;
  /** Interface language */
  language?: string | null;
  imageLightbox?: ConfigImageLightboxInput | null;
  /** Set to true to disable creating new objects via the dropdown menus */
  disableDropdownCreate?: ConfigDisableDropdownCreateInput | null;
  /** Handy Connection Key */
  handyKey?: string | null;
  /** Funscript Time Offset */
  funscriptOffset?: number | null;
  /** Whether to use Stash Hosted Funscript */
  useStashHostedFunscript?: boolean | null;
  /** True if we should not auto-open a browser window on startup */
  noBrowser?: boolean | null;
  /** True if we should send notifications to the desktop */
  notificationsEnabled?: boolean | null;
};

export type ConfigInterfaceResult = {
  /** True if SFW content mode is enabled */
  sfwContentMode: boolean;
  /** Ordered list of items that should be shown in the menu */
  menuItems: string[] | null;
  /** Enable sound on mouseover previews */
  soundOnPreview: boolean | null;
  /** Show title and tags in wall view */
  wallShowTitle: boolean | null;
  /** Wall playback type */
  wallPlayback: string | null;
  /** Show scene scrubber by default */
  showScrubber: boolean | null;
  /** Maximum duration (in seconds) in which a scene video will loop in the scene player */
  maximumLoopDuration: number | null;
  /** True if we should not auto-open a browser window on startup */
  noBrowser: boolean | null;
  /** True if we should send desktop notifications */
  notificationsEnabled: boolean | null;
  /** If true, video will autostart on load in the scene player */
  autostartVideo: boolean | null;
  /** If true, video will autostart when loading from play random or play selected */
  autostartVideoOnPlaySelected: boolean | null;
  /** If true, next scene in playlist will be played at video end by default */
  continuePlaylistDefault: boolean | null;
  /** If true, studio overlays will be shown as text instead of logo images */
  showStudioAsText: boolean | null;
  /** Custom CSS */
  css: string | null;
  cssEnabled: boolean | null;
  /** Custom Javascript */
  javascript: string | null;
  javascriptEnabled: boolean | null;
  /** Custom Locales */
  customLocales: string | null;
  customLocalesEnabled: boolean | null;
  /** When true, disables all customizations (plugins, CSS, JavaScript, locales) for troubleshooting */
  disableCustomizations: boolean | null;
  /** Interface language */
  language: string | null;
  imageLightbox: ConfigImageLightboxResult;
  /** Fields are true if creating via dropdown menus are disabled */
  disableDropdownCreate: ConfigDisableDropdownCreate;
  /** Handy Connection Key */
  handyKey: string | null;
  /** Funscript Time Offset */
  funscriptOffset: number | null;
  /** Whether to use Stash Hosted Funscript */
  useStashHostedFunscript: boolean | null;
};

/** All configuration settings */
export type ConfigResult = {
  general: ConfigGeneralResult;
  interface: ConfigInterfaceResult;
  dlna: ConfigDLNAResult;
  scraping: ConfigScrapingResult;
  defaults: ConfigDefaultSettingsResult;
  ui: Record<string, JsonValue>;
  plugins: Record<string, JsonValue>;
};

export type ConfigScrapingInput = {
  /** Scraper user agent string */
  scraperUserAgent?: string | null;
  /** Scraper CDP path. Path to chrome executable or remote address */
  scraperCDPPath?: string | null;
  /** Whether the scraper should check for invalid certificates */
  scraperCertCheck?: boolean | null;
  /** Tags blacklist during scraping */
  excludeTagPatterns?: string[] | null;
};

export type ConfigScrapingResult = {
  /** Scraper user agent string */
  scraperUserAgent: string | null;
  /** Scraper CDP path. Path to chrome executable or remote address */
  scraperCDPPath: string | null;
  /** Whether the scraper should check for invalid certificates */
  scraperCertCheck: boolean;
  /** Tags blacklist during scraping */
  excludeTagPatterns: string[];
};

export type CriterionModifier =
  /** = */
  | 'EQUALS'
  /** != */
  | 'NOT_EQUALS'
  /** > */
  | 'GREATER_THAN'
  /** < */
  | 'LESS_THAN'
  /** IS NULL */
  | 'IS_NULL'
  /** IS NOT NULL */
  | 'NOT_NULL'
  /** INCLUDES ALL */
  | 'INCLUDES_ALL'
  | 'INCLUDES'
  | 'EXCLUDES'
  /** MATCHES REGEX */
  | 'MATCHES_REGEX'
  /** NOT MATCHES REGEX */
  | 'NOT_MATCHES_REGEX'
  /** >= AND <= */
  | 'BETWEEN'
  /** < OR > */
  | 'NOT_BETWEEN';

export type CustomFieldCriterionInput = {
  field: string;
  value?: JsonValue[] | null;
  modifier: CriterionModifier;
};

export type CustomFieldsInput = {
  /** If populated, the entire custom fields map will be replaced with this value */
  full?: Record<string, JsonValue> | null;
  /** If populated, only the keys in this map will be updated */
  partial?: Record<string, JsonValue> | null;
  /** Remove any keys in this list */
  remove?: string[] | null;
};

export type DLNAIP = {
  ipAddress: string;
  /** Time until IP will be no longer allowed/disallowed */
  until: string | null;
};

export type DLNAStatus = {
  running: boolean;
  /** If not currently running, time until it will be started. If running, time until it will be stopped */
  until: string | null;
  recentIPAddresses: string[];
  allowedIPAddresses: DLNAIP[];
};

export type DateCriterionInput = {
  value: string;
  value2?: string | null;
  modifier: CriterionModifier;
};

export type DestroyFilterInput = {
  id: string;
};

/** Directory structure of a path */
export type Directory = {
  path: string;
  parent: string | null;
  directories: string[];
};

export type DisableDLNAInput = {
  /** Duration to enable, in minutes. 0 or null for indefinite. */
  duration?: number | null;
};

export type DuplicationCriterionInput = {
  /** @deprecated Use phash field instead */
  duplicated?: boolean | null;
  /** Currently unimplemented. Intended for phash distance matching. */
  distance?: number | null;
  /** Filter by phash duplication */
  phash?: boolean | null;
  /** Filter by URL duplication */
  url?: boolean | null;
  /** Filter by Stash ID duplication */
  stash_id?: boolean | null;
  /** Filter by title duplication */
  title?: boolean | null;
};

export type EnableDLNAInput = {
  /** Duration to enable, in minutes. 0 or null for indefinite. */
  duration?: number | null;
};

export type ExportObjectTypeInput = {
  ids?: string[] | null;
  all?: boolean | null;
};

export type ExportObjectsInput = {
  scenes?: ExportObjectTypeInput | null;
  images?: ExportObjectTypeInput | null;
  studios?: ExportObjectTypeInput | null;
  performers?: ExportObjectTypeInput | null;
  tags?: ExportObjectTypeInput | null;
  groups?: ExportObjectTypeInput | null;
  /** @deprecated Use groups instead */
  movies?: ExportObjectTypeInput | null;
  galleries?: ExportObjectTypeInput | null;
  includeDependencies?: boolean | null;
};

export type FileDuplicationCriterionInput = {
  /** @deprecated Use phash field instead */
  duplicated?: boolean | null;
  /** Currently unimplemented. Intended for phash distance matching. */
  distance?: number | null;
  /** Filter by phash duplication */
  phash?: boolean | null;
};

export type FileFilterType = {
  AND?: FileFilterType | null;
  OR?: FileFilterType | null;
  NOT?: FileFilterType | null;
  path?: StringCriterionInput | null;
  basename?: StringCriterionInput | null;
  dir?: StringCriterionInput | null;
  parent_folder?: HierarchicalMultiCriterionInput | null;
  zip_file?: MultiCriterionInput | null;
  /** Filter by modification time */
  mod_time?: TimestampCriterionInput | null;
  /** Filter files by duplication criteria (only phash applies to files) */
  duplicated?: FileDuplicationCriterionInput | null;
  /** find files based on hash */
  hashes?: FingerprintFilterInput[] | null;
  video_file_filter?: VideoFileFilterInput | null;
  image_file_filter?: ImageFileFilterInput | null;
  scene_count?: IntCriterionInput | null;
  image_count?: IntCriterionInput | null;
  gallery_count?: IntCriterionInput | null;
  /** Filter by related scenes that meet this criteria */
  scenes_filter?: SceneFilterType | null;
  /** Filter by related images that meet this criteria */
  images_filter?: ImageFilterType | null;
  /** Filter by related galleries that meet this criteria */
  galleries_filter?: GalleryFilterType | null;
  /** Filter by creation time */
  created_at?: TimestampCriterionInput | null;
  /** Filter by last update time */
  updated_at?: TimestampCriterionInput | null;
};

export type FileSetFingerprintsInput = {
  id: string;
  /** only supplied fingerprint types will be modified */
  fingerprints: SetFingerprintsInput[];
};

export type FilterMode =
  | 'SCENES'
  | 'PERFORMERS'
  | 'STUDIOS'
  | 'GALLERIES'
  | 'SCENE_MARKERS'
  | 'MOVIES'
  | 'GROUPS'
  | 'TAGS'
  | 'IMAGES';

export type FindFilesResultType = {
  count: number;
  /** Total megapixels of any image files */
  megapixels: number;
  /** Total duration in seconds of any video files */
  duration: number;
  /** Total file size in bytes */
  size: number;
  files: BaseFile[];
};

export type FindFilterType = {
  q?: string | null;
  page?: number | null;
  /** use per_page = -1 to indicate all results. Defaults to 25. */
  per_page?: number | null;
  sort?: string | null;
  direction?: SortDirectionEnum | null;
};

export type FindFoldersResultType = {
  count: number;
  folders: Folder[];
};

export type FindGalleriesResultType = {
  count: number;
  galleries: Gallery[];
};

export type FindGalleryChaptersResultType = {
  count: number;
  chapters: GalleryChapter[];
};

export type FindGroupsResultType = {
  count: number;
  groups: Group[];
};

export type FindImagesResultType = {
  count: number;
  /** Total megapixels of the images */
  megapixels: number;
  /** Total file size in bytes */
  filesize: number;
  images: Image[];
};

export type FindJobInput = {
  id: string;
};

export type FindMoviesResultType = {
  count: number;
  movies: Movie[];
};

export type FindPerformersResultType = {
  count: number;
  performers: Performer[];
};

export type FindSceneMarkersResultType = {
  count: number;
  scene_markers: SceneMarker[];
};

export type FindScenesResultType = {
  count: number;
  /** Total duration in seconds */
  duration: number;
  /** Total file size in bytes */
  filesize: number;
  scenes: Scene[];
};

export type FindStudiosResultType = {
  count: number;
  studios: Studio[];
};

export type FindTagsResultType = {
  count: number;
  tags: Tag[];
};

export type Fingerprint = {
  type: string;
  value: string;
};

export type FingerprintFilterInput = {
  type: string;
  value: string;
  /** Hamming distance - defaults to 0 */
  distance?: number | null;
};

export type FloatCriterionInput = {
  value: number;
  value2?: number | null;
  modifier: CriterionModifier;
};

export type Folder = {
  id: string;
  path: string;
  basename: string;
  /** @deprecated Use parent_folder instead */
  parent_folder_id: string | null;
  /** @deprecated Use zip_file instead */
  zip_file_id: string | null;
  parent_folder: Folder | null;
  /** Returns all parent folders in order from immediate parent to top-level */
  parent_folders: Folder[];
  zip_file: BasicFile | null;
  /** Returns direct sub-folders */
  sub_folders: Folder[];
  mod_time: string;
  created_at: string;
  updated_at: string;
};

export type FolderFilterType = {
  AND?: FolderFilterType | null;
  OR?: FolderFilterType | null;
  NOT?: FolderFilterType | null;
  path?: StringCriterionInput | null;
  basename?: StringCriterionInput | null;
  parent_folder?: HierarchicalMultiCriterionInput | null;
  zip_file?: MultiCriterionInput | null;
  /** Filter by modification time */
  mod_time?: TimestampCriterionInput | null;
  gallery_count?: IntCriterionInput | null;
  /** Filter by files that meet this criteria */
  files_filter?: FileFilterType | null;
  /** Filter by related galleries that meet this criteria */
  galleries_filter?: GalleryFilterType | null;
  /** Filter by creation time */
  created_at?: TimestampCriterionInput | null;
  /** Filter by last update time */
  updated_at?: TimestampCriterionInput | null;
};

/** Gallery type */
export type Gallery = {
  id: string;
  title: string | null;
  code: string | null;
  /** @deprecated Use urls */
  url: string | null;
  urls: string[];
  date: string | null;
  details: string | null;
  photographer: string | null;
  rating100: number | null;
  organized: boolean;
  created_at: string;
  updated_at: string;
  files: GalleryFile[];
  folder: Folder | null;
  chapters: GalleryChapter[];
  scenes: Scene[];
  studio: Studio | null;
  image_count: number;
  tags: Tag[];
  performers: Performer[];
  cover: Image | null;
  paths: GalleryPathsType;
  custom_fields: Record<string, JsonValue>;
  image: Image;
};

export type GalleryAddInput = {
  gallery_id: string;
  image_ids: string[];
};

export type GalleryChapter = {
  id: string;
  gallery: Gallery;
  title: string;
  image_index: number;
  created_at: string;
  updated_at: string;
};

export type GalleryChapterCreateInput = {
  gallery_id: string;
  title: string;
  image_index: number;
};

export type GalleryChapterUpdateInput = {
  id: string;
  gallery_id?: string | null;
  title?: string | null;
  image_index?: number | null;
};

export type GalleryCreateInput = {
  title: string;
  code?: string | null;
  /** @deprecated Use urls */
  url?: string | null;
  urls?: string[] | null;
  date?: string | null;
  details?: string | null;
  photographer?: string | null;
  rating100?: number | null;
  organized?: boolean | null;
  scene_ids?: string[] | null;
  studio_id?: string | null;
  tag_ids?: string[] | null;
  performer_ids?: string[] | null;
  custom_fields?: Record<string, JsonValue> | null;
};

export type GalleryDestroyInput = {
  ids: string[];
  /**
   * If true, then the zip file will be deleted if the gallery is zip-file-based.
   * If gallery is folder-based, then any files not associated with other
   * galleries will be deleted, along with the folder, if it is not empty.
   */
  delete_file?: boolean | null;
  delete_generated?: boolean | null;
  /** If true, delete the file entry from the database if the file is not assigned to any other objects */
  destroy_file_entry?: boolean | null;
};

export type GalleryFile = {
  id: string;
  path: string;
  basename: string;
  /** @deprecated Use parent_folder instead */
  parent_folder_id: string;
  /** @deprecated Use zip_file instead */
  zip_file_id: string | null;
  parent_folder: Folder;
  zip_file: BasicFile | null;
  mod_time: string;
  size: number;
  fingerprint: string | null;
  fingerprints: Fingerprint[];
  created_at: string;
  updated_at: string;
};

export type GalleryFilterType = {
  AND?: GalleryFilterType | null;
  OR?: GalleryFilterType | null;
  NOT?: GalleryFilterType | null;
  id?: IntCriterionInput | null;
  title?: StringCriterionInput | null;
  details?: StringCriterionInput | null;
  /** Filter by file checksum */
  checksum?: StringCriterionInput | null;
  /** Filter by path */
  path?: StringCriterionInput | null;
  /** Filter by zip-file count */
  file_count?: IntCriterionInput | null;
  /** Filter to only include galleries missing this property */
  is_missing?: string | null;
  /** Filter to include/exclude galleries that were created from zip */
  is_zip?: boolean | null;
  rating100?: IntCriterionInput | null;
  /** Filter by organized */
  organized?: boolean | null;
  /** Filter by average image resolution */
  average_resolution?: ResolutionCriterionInput | null;
  /** Filter to only include galleries that have chapters. `true` or `false` */
  has_chapters?: string | null;
  /** Filter to only include galleries with these scenes */
  scenes?: MultiCriterionInput | null;
  /** Filter to only include galleries with this studio */
  studios?: HierarchicalMultiCriterionInput | null;
  /** Filter to only include galleries with these tags */
  tags?: HierarchicalMultiCriterionInput | null;
  /** Filter by tag count */
  tag_count?: IntCriterionInput | null;
  /** Filter to only include galleries with performers with these tags */
  performer_tags?: HierarchicalMultiCriterionInput | null;
  /** Filter to only include galleries with these performers */
  performers?: MultiCriterionInput | null;
  /** Filter by performer count */
  performer_count?: IntCriterionInput | null;
  /** Filter galleries that have performers that have been favorited */
  performer_favorite?: boolean | null;
  /** Filter galleries by performer age at time of gallery */
  performer_age?: IntCriterionInput | null;
  /** Filter by number of images in this gallery */
  image_count?: IntCriterionInput | null;
  /** Filter by url */
  url?: StringCriterionInput | null;
  /** Filter by date */
  date?: DateCriterionInput | null;
  /** Filter by creation time */
  created_at?: TimestampCriterionInput | null;
  /** Filter by last update time */
  updated_at?: TimestampCriterionInput | null;
  /** Filter by studio code */
  code?: StringCriterionInput | null;
  /** Filter by photographer */
  photographer?: StringCriterionInput | null;
  /** Filter by related scenes that meet this criteria */
  scenes_filter?: SceneFilterType | null;
  /** Filter by related images that meet this criteria */
  images_filter?: ImageFilterType | null;
  /** Filter by related performers that meet this criteria */
  performers_filter?: PerformerFilterType | null;
  /** Filter by related studios that meet this criteria */
  studios_filter?: StudioFilterType | null;
  /** Filter by related tags that meet this criteria */
  tags_filter?: TagFilterType | null;
  /** Filter by related files that meet this criteria */
  files_filter?: FileFilterType | null;
  /** Filter by related folders that meet this criteria */
  folders_filter?: FolderFilterType | null;
  /** Filter by parent folder of the zip or folder the gallery is in */
  parent_folder?: HierarchicalMultiCriterionInput | null;
  custom_fields?: CustomFieldCriterionInput[] | null;
};

export type GalleryPathsType = {
  cover: string;
  preview: string;
};

export type GalleryRemoveInput = {
  gallery_id: string;
  image_ids: string[];
};

export type GalleryResetCoverInput = {
  gallery_id: string;
};

export type GallerySetCoverInput = {
  gallery_id: string;
  cover_image_id: string;
};

export type GalleryUpdateInput = {
  clientMutationId?: string | null;
  id: string;
  title?: string | null;
  code?: string | null;
  /** @deprecated Use urls */
  url?: string | null;
  urls?: string[] | null;
  date?: string | null;
  details?: string | null;
  photographer?: string | null;
  rating100?: number | null;
  organized?: boolean | null;
  scene_ids?: string[] | null;
  studio_id?: string | null;
  tag_ids?: string[] | null;
  performer_ids?: string[] | null;
  primary_file_id?: string | null;
  custom_fields?: CustomFieldsInput | null;
};

export type GenderCriterionInput = {
  value?: GenderEnum | null;
  value_list?: GenderEnum[] | null;
  modifier: CriterionModifier;
};

export type GenderEnum =
  | 'MALE'
  | 'FEMALE'
  | 'TRANSGENDER_MALE'
  | 'TRANSGENDER_FEMALE'
  | 'INTERSEX'
  | 'NON_BINARY';

export type GenerateAPIKeyInput = {
  clear?: boolean | null;
};

export type GenerateMetadataInput = {
  covers?: boolean | null;
  sprites?: boolean | null;
  previews?: boolean | null;
  imagePreviews?: boolean | null;
  previewOptions?: GeneratePreviewOptionsInput | null;
  markers?: boolean | null;
  markerImagePreviews?: boolean | null;
  markerScreenshots?: boolean | null;
  transcodes?: boolean | null;
  /** Generate transcodes even if not required */
  forceTranscodes?: boolean | null;
  /** Generate video phashes during scan */
  phashes?: boolean | null;
  interactiveHeatmapsSpeeds?: boolean | null;
  /** Generate image phashes during scan */
  imagePhashes?: boolean | null;
  imageThumbnails?: boolean | null;
  clipPreviews?: boolean | null;
  /** scene ids to generate for */
  sceneIDs?: string[] | null;
  /** marker ids to generate for */
  markerIDs?: string[] | null;
  /** image ids to generate for */
  imageIDs?: string[] | null;
  /** gallery ids to generate for */
  galleryIDs?: string[] | null;
  /** paths to run generate on, in addition to the other ID lists */
  paths?: string[] | null;
  /** overwrite existing media */
  overwrite?: boolean | null;
};

export type GenerateMetadataOptions = {
  covers: boolean | null;
  sprites: boolean | null;
  previews: boolean | null;
  imagePreviews: boolean | null;
  previewOptions: GeneratePreviewOptions | null;
  markers: boolean | null;
  markerImagePreviews: boolean | null;
  markerScreenshots: boolean | null;
  transcodes: boolean | null;
  phashes: boolean | null;
  interactiveHeatmapsSpeeds: boolean | null;
  imageThumbnails: boolean | null;
  clipPreviews: boolean | null;
};

export type GeneratePreviewOptions = {
  /** Number of segments in a preview file */
  previewSegments: number | null;
  /** Preview segment duration, in seconds */
  previewSegmentDuration: number | null;
  /** Duration of start of video to exclude when generating previews */
  previewExcludeStart: string | null;
  /** Duration of end of video to exclude when generating previews */
  previewExcludeEnd: string | null;
  /** Preset when generating preview */
  previewPreset: PreviewPreset | null;
};

export type GeneratePreviewOptionsInput = {
  /** Number of segments in a preview file */
  previewSegments?: number | null;
  /** Preview segment duration, in seconds */
  previewSegmentDuration?: number | null;
  /** Duration of start of video to exclude when generating previews */
  previewExcludeStart?: string | null;
  /** Duration of end of video to exclude when generating previews */
  previewExcludeEnd?: string | null;
  /** Preset when generating preview */
  previewPreset?: PreviewPreset | null;
};

export type Group = {
  id: string;
  name: string;
  aliases: string | null;
  /** Duration in seconds */
  duration: number | null;
  date: string | null;
  rating100: number | null;
  studio: Studio | null;
  director: string | null;
  synopsis: string | null;
  urls: string[];
  tags: Tag[];
  created_at: string;
  updated_at: string;
  containing_groups: GroupDescription[];
  sub_groups: GroupDescription[];
  front_image_path: string | null;
  back_image_path: string | null;
  scene_count: number;
  performer_count: number;
  sub_group_count: number;
  scenes: Scene[];
  o_counter: number | null;
  custom_fields: Record<string, JsonValue>;
};

export type GroupCreateInput = {
  name: string;
  aliases?: string | null;
  /** Duration in seconds */
  duration?: number | null;
  date?: string | null;
  rating100?: number | null;
  studio_id?: string | null;
  director?: string | null;
  synopsis?: string | null;
  urls?: string[] | null;
  tag_ids?: string[] | null;
  containing_groups?: GroupDescriptionInput[] | null;
  sub_groups?: GroupDescriptionInput[] | null;
  /** This should be a URL or a base64 encoded data URL */
  front_image?: string | null;
  /** This should be a URL or a base64 encoded data URL */
  back_image?: string | null;
  custom_fields?: Record<string, JsonValue> | null;
};

/** GroupDescription represents a relationship to a group with a description of the relationship */
export type GroupDescription = {
  group: Group;
  description: string | null;
};

export type GroupDescriptionInput = {
  group_id: string;
  description?: string | null;
};

export type GroupDestroyInput = {
  id: string;
};

export type GroupFilterType = {
  AND?: GroupFilterType | null;
  OR?: GroupFilterType | null;
  NOT?: GroupFilterType | null;
  name?: StringCriterionInput | null;
  director?: StringCriterionInput | null;
  synopsis?: StringCriterionInput | null;
  /** Filter by duration (in seconds) */
  duration?: IntCriterionInput | null;
  rating100?: IntCriterionInput | null;
  /** Filter to only include groups with this studio */
  studios?: HierarchicalMultiCriterionInput | null;
  /** Filter to only include groups missing this property */
  is_missing?: string | null;
  /** Filter by url */
  url?: StringCriterionInput | null;
  /** Filter to only include groups where performer appears in a scene */
  performers?: MultiCriterionInput | null;
  /** Filter to only include groups with these tags */
  tags?: HierarchicalMultiCriterionInput | null;
  /** Filter by tag count */
  tag_count?: IntCriterionInput | null;
  /** Filter by date */
  date?: DateCriterionInput | null;
  /** Filter by creation time */
  created_at?: TimestampCriterionInput | null;
  /** Filter by last update time */
  updated_at?: TimestampCriterionInput | null;
  /** Filter by o-counter */
  o_counter?: IntCriterionInput | null;
  /** Filter by containing groups */
  containing_groups?: HierarchicalMultiCriterionInput | null;
  /** Filter by sub groups */
  sub_groups?: HierarchicalMultiCriterionInput | null;
  /** Filter by number of containing groups the group has */
  containing_group_count?: IntCriterionInput | null;
  /** Filter by number of sub-groups the group has */
  sub_group_count?: IntCriterionInput | null;
  /** Filter by number of scenes the group has */
  scene_count?: IntCriterionInput | null;
  /** Filter by related scenes that meet this criteria */
  scenes_filter?: SceneFilterType | null;
  /** Filter by related studios that meet this criteria */
  studios_filter?: StudioFilterType | null;
  /** Filter by custom fields */
  custom_fields?: CustomFieldCriterionInput[] | null;
};

export type GroupSubGroupAddInput = {
  containing_group_id: string;
  sub_groups: GroupDescriptionInput[];
  /** The index at which to insert the sub groups. If not provided, the sub groups will be appended to the end */
  insert_index?: number | null;
};

export type GroupSubGroupRemoveInput = {
  containing_group_id: string;
  sub_group_ids: string[];
};

export type GroupUpdateInput = {
  id: string;
  name?: string | null;
  aliases?: string | null;
  duration?: number | null;
  date?: string | null;
  rating100?: number | null;
  studio_id?: string | null;
  director?: string | null;
  synopsis?: string | null;
  urls?: string[] | null;
  tag_ids?: string[] | null;
  containing_groups?: GroupDescriptionInput[] | null;
  sub_groups?: GroupDescriptionInput[] | null;
  /** This should be a URL or a base64 encoded data URL */
  front_image?: string | null;
  /** This should be a URL or a base64 encoded data URL */
  back_image?: string | null;
  custom_fields?: CustomFieldsInput | null;
};

export type HashAlgorithm =
  | 'MD5'
  /** oshash */
  | 'OSHASH';

export type HierarchicalMultiCriterionInput = {
  value?: string[] | null;
  modifier: CriterionModifier;
  depth?: number | null;
  excludes?: string[] | null;
};

export type HistoryMutationResult = {
  count: number;
  history: string[];
};

export type IdentifyFieldOptions = {
  field: string;
  strategy: IdentifyFieldStrategy;
  /** creates missing objects if needed - only applicable for performers, tags and studios */
  createMissing: boolean | null;
};

export type IdentifyFieldOptionsInput = {
  field: string;
  strategy: IdentifyFieldStrategy;
  /** creates missing objects if needed - only applicable for performers, tags and studios */
  createMissing?: boolean | null;
};

export type IdentifyFieldStrategy =
  /** Never sets the field value */
  | 'IGNORE'
  /**
   * For multi-value fields, merge with existing.
   * For single-value fields, ignore if already set
   */
  | 'MERGE'
  /**
   * Always replaces the value if a value is found.
   * For multi-value fields, any existing values are removed and replaced with the
   * scraped values.
   */
  | 'OVERWRITE';

export type IdentifyMetadataInput = {
  /** An ordered list of sources to identify items with. Only the first source that finds a match is used. */
  sources: IdentifySourceInput[];
  /** Options defined here override the configured defaults */
  options?: IdentifyMetadataOptionsInput | null;
  /** scene ids to identify */
  sceneIDs?: string[] | null;
  /** paths of scenes to identify - ignored if scene ids are set */
  paths?: string[] | null;
};

export type IdentifyMetadataOptions = {
  /** any fields missing from here are defaulted to MERGE and createMissing false */
  fieldOptions: IdentifyFieldOptions[] | null;
  /** defaults to true if not provided */
  setCoverImage: boolean | null;
  setOrganized: boolean | null;
  /**
   * defaults to true if not provided
   *
   * @deprecated Use performerGenders
   */
  includeMalePerformers: boolean | null;
  /** Filter to only include performers with these genders. If not provided, all genders are included. */
  performerGenders: GenderEnum[] | null;
  /** defaults to true if not provided */
  skipMultipleMatches: boolean | null;
  /** tag to tag skipped multiple matches with */
  skipMultipleMatchTag: string | null;
  /** defaults to true if not provided */
  skipSingleNamePerformers: boolean | null;
  /** tag to tag skipped single name performers with */
  skipSingleNamePerformerTag: string | null;
};

export type IdentifyMetadataOptionsInput = {
  /** any fields missing from here are defaulted to MERGE and createMissing false */
  fieldOptions?: IdentifyFieldOptionsInput[] | null;
  /** defaults to true if not provided */
  setCoverImage?: boolean | null;
  setOrganized?: boolean | null;
  /**
   * defaults to true if not provided
   *
   * @deprecated Use performerGenders
   */
  includeMalePerformers?: boolean | null;
  /** Filter to only include performers with these genders. If not provided, all genders are included. */
  performerGenders?: GenderEnum[] | null;
  /** defaults to true if not provided */
  skipMultipleMatches?: boolean | null;
  /** tag to tag skipped multiple matches with */
  skipMultipleMatchTag?: string | null;
  /** defaults to true if not provided */
  skipSingleNamePerformers?: boolean | null;
  /** tag to tag skipped single name performers with */
  skipSingleNamePerformerTag?: string | null;
};

export type IdentifyMetadataTaskOptions = {
  /** An ordered list of sources to identify items with. Only the first source that finds a match is used. */
  sources: IdentifySource[];
  /** Options defined here override the configured defaults */
  options: IdentifyMetadataOptions | null;
};

export type IdentifySource = {
  source: ScraperSource;
  /** Options defined for a source override the defaults */
  options: IdentifyMetadataOptions | null;
};

export type IdentifySourceInput = {
  source: ScraperSourceInput;
  /** Options defined for a source override the defaults */
  options?: IdentifyMetadataOptionsInput | null;
};

export type Image = {
  id: string;
  title: string | null;
  code: string | null;
  rating100: number | null;
  /** @deprecated Use urls */
  url: string | null;
  urls: string[];
  date: string | null;
  details: string | null;
  photographer: string | null;
  o_counter: number | null;
  organized: boolean;
  created_at: string;
  updated_at: string;
  /** @deprecated Use visual_files */
  files: ImageFile[];
  visual_files: VisualFile[];
  paths: ImagePathsType;
  galleries: Gallery[];
  studio: Studio | null;
  tags: Tag[];
  performers: Performer[];
  custom_fields: Record<string, JsonValue>;
};

export type ImageDestroyInput = {
  id: string;
  delete_file?: boolean | null;
  delete_generated?: boolean | null;
  /** If true, delete the file entry from the database if the file is not assigned to any other objects */
  destroy_file_entry?: boolean | null;
};

export type ImageFile = {
  id: string;
  path: string;
  basename: string;
  /** @deprecated Use parent_folder instead */
  parent_folder_id: string;
  /** @deprecated Use zip_file instead */
  zip_file_id: string | null;
  parent_folder: Folder;
  zip_file: BasicFile | null;
  mod_time: string;
  size: number;
  fingerprint: string | null;
  fingerprints: Fingerprint[];
  format: string;
  width: number;
  height: number;
  created_at: string;
  updated_at: string;
};

export type ImageFileFilterInput = {
  format?: StringCriterionInput | null;
  resolution?: ResolutionCriterionInput | null;
  orientation?: OrientationCriterionInput | null;
};

export type ImageFileType = {
  mod_time: string;
  size: number;
  width: number;
  height: number;
};

export type ImageFilterType = {
  AND?: ImageFilterType | null;
  OR?: ImageFilterType | null;
  NOT?: ImageFilterType | null;
  title?: StringCriterionInput | null;
  details?: StringCriterionInput | null;
  /**  Filter by image id */
  id?: IntCriterionInput | null;
  /** Filter by file checksum */
  checksum?: StringCriterionInput | null;
  /** Filter by file phash distance */
  phash_distance?: PhashDistanceCriterionInput | null;
  /** Filter by path */
  path?: StringCriterionInput | null;
  /** Filter by file count */
  file_count?: IntCriterionInput | null;
  rating100?: IntCriterionInput | null;
  /** Filter by date */
  date?: DateCriterionInput | null;
  /** Filter by url */
  url?: StringCriterionInput | null;
  /** Filter by organized */
  organized?: boolean | null;
  /** Filter by o-counter */
  o_counter?: IntCriterionInput | null;
  /** Filter by resolution */
  resolution?: ResolutionCriterionInput | null;
  /** Filter by orientation */
  orientation?: OrientationCriterionInput | null;
  /** Filter to only include images missing this property */
  is_missing?: string | null;
  /** Filter to only include images with this studio */
  studios?: HierarchicalMultiCriterionInput | null;
  /** Filter to only include images with these tags */
  tags?: HierarchicalMultiCriterionInput | null;
  /** Filter by tag count */
  tag_count?: IntCriterionInput | null;
  /** Filter to only include images with performers with these tags */
  performer_tags?: HierarchicalMultiCriterionInput | null;
  /** Filter to only include images with these performers */
  performers?: MultiCriterionInput | null;
  /** Filter by performer count */
  performer_count?: IntCriterionInput | null;
  /** Filter images that have performers that have been favorited */
  performer_favorite?: boolean | null;
  /** Filter images by performer age at time of image */
  performer_age?: IntCriterionInput | null;
  /** Filter to only include images with these galleries */
  galleries?: MultiCriterionInput | null;
  /** Filter by creation time */
  created_at?: TimestampCriterionInput | null;
  /** Filter by last update time */
  updated_at?: TimestampCriterionInput | null;
  /** Filter by studio code */
  code?: StringCriterionInput | null;
  /** Filter by photographer */
  photographer?: StringCriterionInput | null;
  /** Filter by related galleries that meet this criteria */
  galleries_filter?: GalleryFilterType | null;
  /** Filter by related performers that meet this criteria */
  performers_filter?: PerformerFilterType | null;
  /** Filter by related studios that meet this criteria */
  studios_filter?: StudioFilterType | null;
  /** Filter by related tags that meet this criteria */
  tags_filter?: TagFilterType | null;
  /** Filter by related files that meet this criteria */
  files_filter?: FileFilterType | null;
  /** Filter by custom fields */
  custom_fields?: CustomFieldCriterionInput[] | null;
};

export type ImageLightboxDisplayMode =
  | 'ORIGINAL'
  | 'FIT_XY'
  | 'FIT_X';

export type ImageLightboxScrollMode =
  | 'ZOOM'
  | 'PAN_Y';

export type ImagePathsType = {
  thumbnail: string | null;
  preview: string | null;
  image: string | null;
};

export type ImageUpdateInput = {
  clientMutationId?: string | null;
  id: string;
  title?: string | null;
  code?: string | null;
  rating100?: number | null;
  organized?: boolean | null;
  /** @deprecated Use urls */
  url?: string | null;
  urls?: string[] | null;
  date?: string | null;
  details?: string | null;
  photographer?: string | null;
  studio_id?: string | null;
  performer_ids?: string[] | null;
  tag_ids?: string[] | null;
  gallery_ids?: string[] | null;
  primary_file_id?: string | null;
  custom_fields?: CustomFieldsInput | null;
};

export type ImagesDestroyInput = {
  ids: string[];
  delete_file?: boolean | null;
  delete_generated?: boolean | null;
  /** If true, delete the file entry from the database if the file is not assigned to any other objects */
  destroy_file_entry?: boolean | null;
};

export type ImportDuplicateEnum =
  | 'IGNORE'
  | 'OVERWRITE'
  | 'FAIL';

export type ImportMissingRefEnum =
  | 'IGNORE'
  | 'FAIL'
  | 'CREATE';

export type ImportObjectsInput = {
  file: never;
  duplicateBehaviour: ImportDuplicateEnum;
  missingRefBehaviour: ImportMissingRefEnum;
};

export type IntCriterionInput = {
  value: number;
  value2?: number | null;
  modifier: CriterionModifier;
};

export type Job = {
  id: string;
  status: JobStatus;
  subTasks: string[] | null;
  description: string;
  progress: number | null;
  startTime: string | null;
  endTime: string | null;
  addTime: string;
  error: string | null;
};

export type JobStatus =
  | 'READY'
  | 'RUNNING'
  | 'FINISHED'
  | 'STOPPING'
  | 'CANCELLED'
  | 'FAILED';

export type JobStatusUpdate = {
  type: JobStatusUpdateType;
  job: Job;
};

export type JobStatusUpdateType =
  | 'ADD'
  | 'REMOVE'
  | 'UPDATE';

export type LatestVersion = {
  version: string;
  shorthash: string;
  release_date: string;
  url: string;
};

export type LogEntry = {
  time: string;
  level: LogLevel;
  message: string;
};

export type LogLevel =
  | 'Trace'
  | 'Debug'
  | 'Info'
  | 'Progress'
  | 'Warning'
  | 'Error';

export type MarkerStringsResultType = {
  count: number;
  id: string;
  title: string;
};

export type MigrateBlobsInput = {
  deleteOld?: boolean | null;
};

export type MigrateInput = {
  backupPath: string;
};

export type MigrateSceneScreenshotsInput = {
  deleteFiles?: boolean | null;
  overwriteExisting?: boolean | null;
};

export type MoveFilesInput = {
  ids: string[];
  /** valid for single or multiple file ids */
  destination_folder?: string | null;
  /** valid for single or multiple file ids */
  destination_folder_id?: string | null;
  /** valid only for single file id. If empty, existing basename is used */
  destination_basename?: string | null;
};

export type Movie = {
  id: string;
  name: string;
  aliases: string | null;
  /** Duration in seconds */
  duration: number | null;
  date: string | null;
  rating100: number | null;
  studio: Studio | null;
  director: string | null;
  synopsis: string | null;
  /** @deprecated Use urls */
  url: string | null;
  urls: string[];
  tags: Tag[];
  created_at: string;
  updated_at: string;
  front_image_path: string | null;
  back_image_path: string | null;
  scene_count: number;
  scenes: Scene[];
};

export type MovieCreateInput = {
  name: string;
  aliases?: string | null;
  /** Duration in seconds */
  duration?: number | null;
  date?: string | null;
  rating100?: number | null;
  studio_id?: string | null;
  director?: string | null;
  synopsis?: string | null;
  /** @deprecated Use urls */
  url?: string | null;
  urls?: string[] | null;
  tag_ids?: string[] | null;
  /** This should be a URL or a base64 encoded data URL */
  front_image?: string | null;
  /** This should be a URL or a base64 encoded data URL */
  back_image?: string | null;
};

export type MovieDestroyInput = {
  id: string;
};

export type MovieFilterType = {
  AND?: MovieFilterType | null;
  OR?: MovieFilterType | null;
  NOT?: MovieFilterType | null;
  name?: StringCriterionInput | null;
  director?: StringCriterionInput | null;
  synopsis?: StringCriterionInput | null;
  /** Filter by duration (in seconds) */
  duration?: IntCriterionInput | null;
  rating100?: IntCriterionInput | null;
  /** Filter to only include movies with this studio */
  studios?: HierarchicalMultiCriterionInput | null;
  /** Filter to only include movies missing this property */
  is_missing?: string | null;
  /** Filter by url */
  url?: StringCriterionInput | null;
  /** Filter to only include movies where performer appears in a scene */
  performers?: MultiCriterionInput | null;
  /** Filter to only include movies with these tags */
  tags?: HierarchicalMultiCriterionInput | null;
  /** Filter by tag count */
  tag_count?: IntCriterionInput | null;
  /** Filter by date */
  date?: DateCriterionInput | null;
  /** Filter by creation time */
  created_at?: TimestampCriterionInput | null;
  /** Filter by last update time */
  updated_at?: TimestampCriterionInput | null;
  /** Filter by related scenes that meet this criteria */
  scenes_filter?: SceneFilterType | null;
  /** Filter by related studios that meet this criteria */
  studios_filter?: StudioFilterType | null;
};

export type MovieUpdateInput = {
  id: string;
  name?: string | null;
  aliases?: string | null;
  duration?: number | null;
  date?: string | null;
  rating100?: number | null;
  studio_id?: string | null;
  director?: string | null;
  synopsis?: string | null;
  /** @deprecated Use urls */
  url?: string | null;
  urls?: string[] | null;
  tag_ids?: string[] | null;
  /** This should be a URL or a base64 encoded data URL */
  front_image?: string | null;
  /** This should be a URL or a base64 encoded data URL */
  back_image?: string | null;
};

export type MultiCriterionInput = {
  value?: string[] | null;
  modifier: CriterionModifier;
  excludes?: string[] | null;
};

export type OrientationCriterionInput = {
  value: OrientationEnum[];
};

export type OrientationEnum =
  /** Landscape */
  | 'LANDSCAPE'
  /** Portrait */
  | 'PORTRAIT'
  /** Square */
  | 'SQUARE';

export type Package = {
  package_id: string;
  name: string;
  version: string | null;
  date: string | null;
  requires: Package[];
  sourceURL: string;
  /** The version of this package currently available from the remote source */
  source_package: Package | null;
  metadata: Record<string, JsonValue>;
};

export type PackageSource = {
  name: string | null;
  url: string;
  local_path: string | null;
};

export type PackageSourceInput = {
  name?: string | null;
  url: string;
  local_path?: string | null;
};

export type PackageSpecInput = {
  id: string;
  sourceURL: string;
};

export type PackageType =
  | 'Scraper'
  | 'Plugin';

export type Performer = {
  id: string;
  name: string;
  disambiguation: string | null;
  /** @deprecated Use urls */
  url: string | null;
  urls: string[] | null;
  gender: GenderEnum | null;
  /** @deprecated Use urls */
  twitter: string | null;
  /** @deprecated Use urls */
  instagram: string | null;
  birthdate: string | null;
  ethnicity: string | null;
  country: string | null;
  eye_color: string | null;
  height_cm: number | null;
  measurements: string | null;
  fake_tits: string | null;
  penis_length: number | null;
  circumcised: CircumcisedEnum | null;
  /** @deprecated Use career_start and career_end */
  career_length: string | null;
  career_start: string | null;
  career_end: string | null;
  tattoos: string | null;
  piercings: string | null;
  alias_list: string[];
  favorite: boolean;
  tags: Tag[];
  ignore_auto_tag: boolean;
  image_path: string | null;
  scene_count: number;
  image_count: number;
  gallery_count: number;
  group_count: number;
  /** @deprecated use group_count instead */
  movie_count: number;
  performer_count: number;
  o_counter: number | null;
  scenes: Scene[];
  stash_ids: StashID[];
  rating100: number | null;
  details: string | null;
  death_date: string | null;
  hair_color: string | null;
  weight: number | null;
  created_at: string;
  updated_at: string;
  groups: Group[];
  /** @deprecated use groups instead */
  movies: Movie[];
  custom_fields: Record<string, JsonValue>;
};

export type PerformerCreateInput = {
  name: string;
  disambiguation?: string | null;
  /** @deprecated Use urls */
  url?: string | null;
  urls?: string[] | null;
  gender?: GenderEnum | null;
  birthdate?: string | null;
  ethnicity?: string | null;
  country?: string | null;
  eye_color?: string | null;
  height_cm?: number | null;
  measurements?: string | null;
  fake_tits?: string | null;
  penis_length?: number | null;
  circumcised?: CircumcisedEnum | null;
  /** @deprecated Use career_start and career_end */
  career_length?: string | null;
  career_start?: string | null;
  career_end?: string | null;
  tattoos?: string | null;
  piercings?: string | null;
  /** Duplicate aliases and those equal to name will be ignored (case-insensitive) */
  alias_list?: string[] | null;
  /** @deprecated Use urls */
  twitter?: string | null;
  /** @deprecated Use urls */
  instagram?: string | null;
  favorite?: boolean | null;
  tag_ids?: string[] | null;
  /** This should be a URL or a base64 encoded data URL */
  image?: string | null;
  stash_ids?: StashIDInput[] | null;
  rating100?: number | null;
  details?: string | null;
  death_date?: string | null;
  hair_color?: string | null;
  weight?: number | null;
  ignore_auto_tag?: boolean | null;
  custom_fields?: Record<string, JsonValue> | null;
};

export type PerformerDestroyInput = {
  id: string;
};

export type PerformerFilterType = {
  AND?: PerformerFilterType | null;
  OR?: PerformerFilterType | null;
  NOT?: PerformerFilterType | null;
  name?: StringCriterionInput | null;
  disambiguation?: StringCriterionInput | null;
  details?: StringCriterionInput | null;
  /** Filter by favorite */
  filter_favorites?: boolean | null;
  /** Filter by birth year */
  birth_year?: IntCriterionInput | null;
  /** Filter by age */
  age?: IntCriterionInput | null;
  /** Filter by ethnicity */
  ethnicity?: StringCriterionInput | null;
  /** Filter by country */
  country?: StringCriterionInput | null;
  /** Filter by eye color */
  eye_color?: StringCriterionInput | null;
  /** Filter by height in cm */
  height_cm?: IntCriterionInput | null;
  /** Filter by measurements */
  measurements?: StringCriterionInput | null;
  /** Filter by fake tits value */
  fake_tits?: StringCriterionInput | null;
  /** Filter by penis length value */
  penis_length?: FloatCriterionInput | null;
  /** Filter by circumcision */
  circumcised?: CircumcisionCriterionInput | null;
  /**
   * Deprecated: use career_start and career_end. This filter is non-functional.
   *
   * @deprecated Use career_start and career_end
   */
  career_length?: StringCriterionInput | null;
  /** Filter by career start */
  career_start?: DateCriterionInput | null;
  /** Filter by career end */
  career_end?: DateCriterionInput | null;
  /** Filter by tattoos */
  tattoos?: StringCriterionInput | null;
  /** Filter by piercings */
  piercings?: StringCriterionInput | null;
  /** Filter by aliases */
  aliases?: StringCriterionInput | null;
  /** Filter by gender */
  gender?: GenderCriterionInput | null;
  /** Filter to only include performers missing this property */
  is_missing?: string | null;
  /** Filter to only include performers with these tags */
  tags?: HierarchicalMultiCriterionInput | null;
  /** Filter by tag count */
  tag_count?: IntCriterionInput | null;
  /** Filter by scene count */
  scene_count?: IntCriterionInput | null;
  /** Filter by marker count (via scene) */
  marker_count?: IntCriterionInput | null;
  /** Filter by image count */
  image_count?: IntCriterionInput | null;
  /** Filter by gallery count */
  gallery_count?: IntCriterionInput | null;
  /** Filter by play count */
  play_count?: IntCriterionInput | null;
  /** Filter by o count */
  o_counter?: IntCriterionInput | null;
  /**
   * Filter by StashID
   *
   * @deprecated use stash_ids_endpoint instead
   */
  stash_id_endpoint?: StashIDCriterionInput | null;
  /** Filter by StashIDs */
  stash_ids_endpoint?: StashIDsCriterionInput | null;
  rating100?: IntCriterionInput | null;
  /** Filter by url */
  url?: StringCriterionInput | null;
  /** Filter by hair color */
  hair_color?: StringCriterionInput | null;
  /** Filter by weight */
  weight?: IntCriterionInput | null;
  /** Filter by death year */
  death_year?: IntCriterionInput | null;
  /** Filter by studios where performer appears in scene/image/gallery */
  studios?: HierarchicalMultiCriterionInput | null;
  /** Filter by groups where performer appears in scene */
  groups?: HierarchicalMultiCriterionInput | null;
  /** Filter by performers where performer appears with another performer in scene/image/gallery */
  performers?: MultiCriterionInput | null;
  /** Filter by autotag ignore value */
  ignore_auto_tag?: boolean | null;
  /** Filter by birthdate */
  birthdate?: DateCriterionInput | null;
  /** Filter by death date */
  death_date?: DateCriterionInput | null;
  /** Filter by related scenes that meet this criteria */
  scenes_filter?: SceneFilterType | null;
  /** Filter by related images that meet this criteria */
  images_filter?: ImageFilterType | null;
  /** Filter by related galleries that meet this criteria */
  galleries_filter?: GalleryFilterType | null;
  /** Filter by related tags that meet this criteria */
  tags_filter?: TagFilterType | null;
  /** Filter by related scene markers (via scene) that meet this criteria */
  markers_filter?: SceneMarkerFilterType | null;
  /** Filter by creation time */
  created_at?: TimestampCriterionInput | null;
  /** Filter by last update time */
  updated_at?: TimestampCriterionInput | null;
  custom_fields?: CustomFieldCriterionInput[] | null;
};

export type PerformerMergeInput = {
  source: string[];
  destination: string;
  values?: PerformerUpdateInput | null;
};

export type PerformerUpdateInput = {
  id: string;
  name?: string | null;
  disambiguation?: string | null;
  /** @deprecated Use urls */
  url?: string | null;
  urls?: string[] | null;
  gender?: GenderEnum | null;
  birthdate?: string | null;
  ethnicity?: string | null;
  country?: string | null;
  eye_color?: string | null;
  height_cm?: number | null;
  measurements?: string | null;
  fake_tits?: string | null;
  penis_length?: number | null;
  circumcised?: CircumcisedEnum | null;
  /** @deprecated Use career_start and career_end */
  career_length?: string | null;
  career_start?: string | null;
  career_end?: string | null;
  tattoos?: string | null;
  piercings?: string | null;
  /** Duplicate aliases and those equal to name will be ignored (case-insensitive) */
  alias_list?: string[] | null;
  /** @deprecated Use urls */
  twitter?: string | null;
  /** @deprecated Use urls */
  instagram?: string | null;
  favorite?: boolean | null;
  tag_ids?: string[] | null;
  /** This should be a URL or a base64 encoded data URL */
  image?: string | null;
  stash_ids?: StashIDInput[] | null;
  rating100?: number | null;
  details?: string | null;
  death_date?: string | null;
  hair_color?: string | null;
  weight?: number | null;
  ignore_auto_tag?: boolean | null;
  custom_fields?: CustomFieldsInput | null;
};

export type PhashDistanceCriterionInput = {
  value: string;
  modifier: CriterionModifier;
  distance?: number | null;
};

export type Plugin = {
  id: string;
  name: string;
  description: string | null;
  url: string | null;
  version: string | null;
  enabled: boolean;
  tasks: PluginTask[] | null;
  hooks: PluginHook[] | null;
  settings: PluginSetting[] | null;
  /**
   * Plugin IDs of plugins that this plugin depends on.
   * Applies only for UI plugins to indicate css/javascript load order.
   */
  requires: string[] | null;
  paths: PluginPaths;
};

export type PluginArgInput = {
  key: string;
  value?: PluginValueInput | null;
};

export type PluginHook = {
  name: string;
  description: string | null;
  hooks: string[] | null;
  plugin: Plugin;
};

export type PluginPaths = {
  javascript: string[] | null;
  css: string[] | null;
};

export type PluginResult = {
  error: string | null;
  result: string | null;
};

export type PluginSetting = {
  name: string;
  display_name: string | null;
  description: string | null;
  type: PluginSettingTypeEnum;
};

export type PluginSettingTypeEnum =
  | 'STRING'
  | 'NUMBER'
  | 'BOOLEAN';

export type PluginTask = {
  name: string;
  description: string | null;
  plugin: Plugin;
};

export type PluginValueInput = {
  str?: string | null;
  i?: number | null;
  b?: boolean | null;
  f?: number | null;
  o?: PluginArgInput[] | null;
  a?: PluginValueInput[] | null;
};

export type PreviewPreset =
  /** X264_ULTRAFAST */
  | 'ultrafast'
  /** X264_VERYFAST */
  | 'veryfast'
  /** X264_FAST */
  | 'fast'
  /** X264_MEDIUM */
  | 'medium'
  /** X264_SLOW */
  | 'slow'
  /** X264_SLOWER */
  | 'slower'
  /** X264_VERYSLOW */
  | 'veryslow';

export type RemoveTempDLNAIPInput = {
  address: string;
};

export type ReorderSubGroupsInput = {
  /** ID of the group to reorder sub groups for */
  group_id: string;
  /**
   * IDs of the sub groups to reorder. These must be a subset of the current sub groups.
   * Sub groups will be inserted in this order at the insert_index
   */
  sub_group_ids: string[];
  /** The sub-group ID at which to insert the sub groups */
  insert_at_id: string;
  /** If true, the sub groups will be inserted after the insert_index, otherwise they will be inserted before */
  insert_after?: boolean | null;
};

export type ResolutionCriterionInput = {
  value: ResolutionEnum;
  modifier: CriterionModifier;
};

export type ResolutionEnum =
  /** 144p */
  | 'VERY_LOW'
  /** 240p */
  | 'LOW'
  /** 360p */
  | 'R360P'
  /** 480p */
  | 'STANDARD'
  /** 540p */
  | 'WEB_HD'
  /** 720p */
  | 'STANDARD_HD'
  /** 1080p */
  | 'FULL_HD'
  /** 1440p */
  | 'QUAD_HD'
  /**
   * 1920p
   *
   * @deprecated Use 4K instead
   */
  | 'VR_HD'
  /** 4K */
  | 'FOUR_K'
  /** 5K */
  | 'FIVE_K'
  /** 6K */
  | 'SIX_K'
  /** 7K */
  | 'SEVEN_K'
  /** 8K */
  | 'EIGHT_K'
  /** 8K+ */
  | 'HUGE';

export type SQLExecResult = {
  /**
   * The number of rows affected by the query, usually an UPDATE, INSERT, or DELETE.
   * Not all queries or databases support this feature.
   */
  rows_affected: number | null;
  /**
   * The integer generated by the database in response to a command.
   * Typically this will be from an "auto increment" column when inserting a new row.
   * Not all databases support this feature, and the syntax of such statements varies.
   */
  last_insert_id: number | null;
};

export type SQLQueryResult = {
  /** The column names, in the order they appear in the result set. */
  columns: string[];
  /** The returned rows. */
  rows: ((JsonValue | null)[])[];
};

export type SaveFilterInput = {
  /** provide ID to overwrite existing filter */
  id?: string | null;
  mode: FilterMode;
  name: string;
  find_filter?: FindFilterType | null;
  object_filter?: Record<string, JsonValue> | null;
  ui_options?: Record<string, JsonValue> | null;
};

export type SavedFilter = {
  id: string;
  mode: FilterMode;
  name: string;
  /**
   * JSON-encoded filter string
   *
   * @deprecated use find_filter and object_filter instead
   */
  filter: string;
  find_filter: SavedFindFilterType | null;
  object_filter: Record<string, JsonValue> | null;
  ui_options: Record<string, JsonValue> | null;
};

export type SavedFindFilterType = {
  q: string | null;
  page: number | null;
  /** use per_page = -1 to indicate all results. Defaults to 25. */
  per_page: number | null;
  sort: string | null;
  direction: SortDirectionEnum | null;
};

/** Filter options for meta data scannning */
export type ScanMetaDataFilterInput = {
  /** If set, files with a modification time before this time point are ignored by the scan */
  minModTime?: string | null;
};

export type ScanMetadataInput = {
  paths?: string[] | null;
  /** Forces a rescan on files even if modification time is unchanged */
  rescan?: boolean | null;
  /** Generate covers during scan */
  scanGenerateCovers?: boolean | null;
  /** Generate previews during scan */
  scanGeneratePreviews?: boolean | null;
  /** Generate image previews during scan */
  scanGenerateImagePreviews?: boolean | null;
  /** Generate sprites during scan */
  scanGenerateSprites?: boolean | null;
  /** Generate video phashes during scan */
  scanGeneratePhashes?: boolean | null;
  /** Generate image phashes during scan */
  scanGenerateImagePhashes?: boolean | null;
  /** Generate image thumbnails during scan */
  scanGenerateThumbnails?: boolean | null;
  /** Generate image clip previews during scan */
  scanGenerateClipPreviews?: boolean | null;
  /** Filter options for the scan */
  filter?: ScanMetaDataFilterInput | null;
};

export type ScanMetadataOptions = {
  /** Forces a rescan on files even if modification time is unchanged */
  rescan: boolean;
  /** Generate covers during scan */
  scanGenerateCovers: boolean;
  /** Generate previews during scan */
  scanGeneratePreviews: boolean;
  /** Generate image previews during scan */
  scanGenerateImagePreviews: boolean;
  /** Generate sprites during scan */
  scanGenerateSprites: boolean;
  /** Generate video phashes during scan */
  scanGeneratePhashes: boolean;
  /** Generate image phashes during scan */
  scanGenerateImagePhashes: boolean | null;
  /** Generate image thumbnails during scan */
  scanGenerateThumbnails: boolean;
  /** Generate image clip previews during scan */
  scanGenerateClipPreviews: boolean;
};

export type Scene = {
  id: string;
  title: string | null;
  code: string | null;
  details: string | null;
  director: string | null;
  /** @deprecated Use urls */
  url: string | null;
  urls: string[];
  date: string | null;
  rating100: number | null;
  organized: boolean;
  o_counter: number | null;
  interactive: boolean;
  interactive_speed: number | null;
  captions: VideoCaption[] | null;
  created_at: string;
  updated_at: string;
  /** The last time play count was updated */
  last_played_at: string | null;
  /** The time index a scene was left at */
  resume_time: number | null;
  /** The total time a scene has spent playing */
  play_duration: number | null;
  /** The number ot times a scene has been played */
  play_count: number | null;
  /** Times a scene was played */
  play_history: string[];
  /** Times the o counter was incremented */
  o_history: string[];
  files: VideoFile[];
  paths: ScenePathsType;
  scene_markers: SceneMarker[];
  galleries: Gallery[];
  studio: Studio | null;
  groups: SceneGroup[];
  /** @deprecated Use groups */
  movies: SceneMovie[];
  tags: Tag[];
  performers: Performer[];
  stash_ids: StashID[];
  custom_fields: Record<string, JsonValue>;
  /** Return valid stream paths */
  sceneStreams: SceneStreamEndpoint[];
};

export type SceneCreateInput = {
  title?: string | null;
  code?: string | null;
  details?: string | null;
  director?: string | null;
  /** @deprecated Use urls */
  url?: string | null;
  urls?: string[] | null;
  date?: string | null;
  rating100?: number | null;
  organized?: boolean | null;
  studio_id?: string | null;
  gallery_ids?: string[] | null;
  performer_ids?: string[] | null;
  groups?: SceneGroupInput[] | null;
  /** @deprecated Use groups */
  movies?: SceneMovieInput[] | null;
  tag_ids?: string[] | null;
  /** This should be a URL or a base64 encoded data URL */
  cover_image?: string | null;
  stash_ids?: StashIDInput[] | null;
  /**
   * The first id will be assigned as primary.
   * Files will be reassigned from existing scenes if applicable.
   * Files must not already be primary for another scene.
   */
  file_ids?: string[] | null;
  custom_fields?: Record<string, JsonValue> | null;
};

export type SceneDestroyInput = {
  id: string;
  delete_file?: boolean | null;
  delete_generated?: boolean | null;
  /** If true, delete the file entry from the database if the file is not assigned to any other objects */
  destroy_file_entry?: boolean | null;
};

export type SceneFileType = {
  size: string | null;
  duration: number | null;
  video_codec: string | null;
  audio_codec: string | null;
  width: number | null;
  height: number | null;
  framerate: number | null;
  bitrate: number | null;
};

export type SceneFilterType = {
  AND?: SceneFilterType | null;
  OR?: SceneFilterType | null;
  NOT?: SceneFilterType | null;
  id?: IntCriterionInput | null;
  title?: StringCriterionInput | null;
  code?: StringCriterionInput | null;
  details?: StringCriterionInput | null;
  director?: StringCriterionInput | null;
  /** Filter by file oshash */
  oshash?: StringCriterionInput | null;
  /** Filter by file checksum */
  checksum?: StringCriterionInput | null;
  /**
   * Filter by file phash
   *
   * @deprecated Use phash_distance instead
   */
  phash?: StringCriterionInput | null;
  /** Filter by file phash distance */
  phash_distance?: PhashDistanceCriterionInput | null;
  /** Filter by path */
  path?: StringCriterionInput | null;
  /** Filter by file count */
  file_count?: IntCriterionInput | null;
  rating100?: IntCriterionInput | null;
  /** Filter by organized */
  organized?: boolean | null;
  /** Filter by o-counter */
  o_counter?: IntCriterionInput | null;
  /** Filter Scenes by duplication criteria */
  duplicated?: DuplicationCriterionInput | null;
  /** Filter by resolution */
  resolution?: ResolutionCriterionInput | null;
  /** Filter by orientation */
  orientation?: OrientationCriterionInput | null;
  /** Filter by frame rate */
  framerate?: IntCriterionInput | null;
  /** Filter by bit rate */
  bitrate?: IntCriterionInput | null;
  /** Filter by video codec */
  video_codec?: StringCriterionInput | null;
  /** Filter by audio codec */
  audio_codec?: StringCriterionInput | null;
  /** Filter by duration (in seconds) */
  duration?: IntCriterionInput | null;
  /** Filter to only include scenes which have markers. `true` or `false` */
  has_markers?: string | null;
  /** Filter to only include scenes missing this property */
  is_missing?: string | null;
  /** Filter to only include scenes with this studio */
  studios?: HierarchicalMultiCriterionInput | null;
  /**
   * Filter to only include scenes with this movie
   *
   * @deprecated use groups instead
   */
  movies?: MultiCriterionInput | null;
  /** Filter to only include scenes with this group */
  groups?: HierarchicalMultiCriterionInput | null;
  /** Filter to only include scenes with this gallery */
  galleries?: MultiCriterionInput | null;
  /** Filter to only include scenes with these tags */
  tags?: HierarchicalMultiCriterionInput | null;
  /** Filter by tag count */
  tag_count?: IntCriterionInput | null;
  /** Filter to only include scenes with performers with these tags */
  performer_tags?: HierarchicalMultiCriterionInput | null;
  /** Filter scenes that have performers that have been favorited */
  performer_favorite?: boolean | null;
  /** Filter scenes by performer age at time of scene */
  performer_age?: IntCriterionInput | null;
  /** Filter to only include scenes with these performers */
  performers?: MultiCriterionInput | null;
  /** Filter by performer count */
  performer_count?: IntCriterionInput | null;
  /**
   * Filter by StashID
   *
   * @deprecated use stash_ids_endpoint instead
   */
  stash_id_endpoint?: StashIDCriterionInput | null;
  /** Filter by StashIDs */
  stash_ids_endpoint?: StashIDsCriterionInput | null;
  /** Filter by StashID count */
  stash_id_count?: IntCriterionInput | null;
  /** Filter by url */
  url?: StringCriterionInput | null;
  /** Filter by interactive */
  interactive?: boolean | null;
  /** Filter by InteractiveSpeed */
  interactive_speed?: IntCriterionInput | null;
  /** Filter by captions */
  captions?: StringCriterionInput | null;
  /** Filter by resume time */
  resume_time?: IntCriterionInput | null;
  /** Filter by play count */
  play_count?: IntCriterionInput | null;
  /** Filter by play duration (in seconds) */
  play_duration?: IntCriterionInput | null;
  /** Filter by scene last played time */
  last_played_at?: TimestampCriterionInput | null;
  /** Filter by date */
  date?: DateCriterionInput | null;
  /** Filter by creation time */
  created_at?: TimestampCriterionInput | null;
  /** Filter by last update time */
  updated_at?: TimestampCriterionInput | null;
  /** Filter by related galleries that meet this criteria */
  galleries_filter?: GalleryFilterType | null;
  /** Filter by related performers that meet this criteria */
  performers_filter?: PerformerFilterType | null;
  /** Filter by related studios that meet this criteria */
  studios_filter?: StudioFilterType | null;
  /** Filter by related tags that meet this criteria */
  tags_filter?: TagFilterType | null;
  /**
   * Filter by related movies that meet this criteria
   *
   * @deprecated use groups_filter instead
   */
  movies_filter?: MovieFilterType | null;
  /** Filter by related groups that meet this criteria */
  groups_filter?: GroupFilterType | null;
  /** Filter by related markers that meet this criteria */
  markers_filter?: SceneMarkerFilterType | null;
  /** Filter by related files that meet this criteria */
  files_filter?: FileFilterType | null;
  custom_fields?: CustomFieldCriterionInput[] | null;
};

export type SceneGroup = {
  group: Group;
  scene_index: number | null;
};

export type SceneGroupInput = {
  group_id: string;
  scene_index?: number | null;
};

export type SceneHashInput = {
  checksum?: string | null;
  oshash?: string | null;
};

export type SceneMarker = {
  id: string;
  scene: Scene;
  title: string;
  /** The required start time of the marker (in seconds). Supports decimals. */
  seconds: number;
  /** The optional end time of the marker (in seconds). Supports decimals. */
  end_seconds: number | null;
  primary_tag: Tag;
  tags: Tag[];
  created_at: string;
  updated_at: string;
  /** The path to stream this marker */
  stream: string;
  /** The path to the preview image for this marker */
  preview: string;
  /** The path to the screenshot image for this marker */
  screenshot: string;
};

export type SceneMarkerCreateInput = {
  title: string;
  /** The required start time of the marker (in seconds). Supports decimals. */
  seconds: number;
  /** The optional end time of the marker (in seconds). Supports decimals. */
  end_seconds?: number | null;
  scene_id: string;
  primary_tag_id: string;
  tag_ids?: string[] | null;
};

export type SceneMarkerFilterType = {
  /** Filter to only include scene markers with these tags */
  tags?: HierarchicalMultiCriterionInput | null;
  /** Filter to only include scene markers attached to a scene with these tags */
  scene_tags?: HierarchicalMultiCriterionInput | null;
  /** Filter to only include scene markers with these performers */
  performers?: MultiCriterionInput | null;
  /** Filter to only include scene markers from these scenes */
  scenes?: MultiCriterionInput | null;
  /** Filter by duration (in seconds) */
  duration?: FloatCriterionInput | null;
  /** Filter by creation time */
  created_at?: TimestampCriterionInput | null;
  /** Filter by last update time */
  updated_at?: TimestampCriterionInput | null;
  /** Filter by scene date */
  scene_date?: DateCriterionInput | null;
  /** Filter by scene creation time */
  scene_created_at?: TimestampCriterionInput | null;
  /** Filter by scene last update time */
  scene_updated_at?: TimestampCriterionInput | null;
  /** Filter by related scenes that meet this criteria */
  scene_filter?: SceneFilterType | null;
};

export type SceneMarkerTag = {
  tag: Tag;
  scene_markers: SceneMarker[];
};

export type SceneMarkerUpdateInput = {
  id: string;
  title?: string | null;
  /** The start time of the marker (in seconds). Supports decimals. */
  seconds?: number | null;
  /** The end time of the marker (in seconds). Supports decimals. */
  end_seconds?: number | null;
  scene_id?: string | null;
  primary_tag_id?: string | null;
  tag_ids?: string[] | null;
};

export type SceneMergeInput = {
  /**
   * If destination scene has no files, then the primary file of the
   * first source scene will be assigned as primary
   */
  source: string[];
  destination: string;
  values?: SceneUpdateInput | null;
  play_history?: boolean | null;
  o_history?: boolean | null;
};

export type SceneMovie = {
  movie: Movie;
  scene_index: number | null;
};

export type SceneMovieID = {
  movie_id: string;
  scene_index: string | null;
};

export type SceneMovieInput = {
  movie_id: string;
  scene_index?: number | null;
};

export type SceneParserInput = {
  ignoreWords?: string[] | null;
  whitespaceCharacters?: string | null;
  capitalizeTitle?: boolean | null;
  ignoreOrganized?: boolean | null;
};

export type SceneParserResult = {
  scene: Scene;
  title: string | null;
  code: string | null;
  details: string | null;
  director: string | null;
  url: string | null;
  date: string | null;
  /** @deprecated Use 1-100 range with rating100 */
  rating: number | null;
  rating100: number | null;
  studio_id: string | null;
  gallery_ids: string[] | null;
  performer_ids: string[] | null;
  movies: SceneMovieID[] | null;
  tag_ids: string[] | null;
};

export type SceneParserResultType = {
  count: number;
  results: SceneParserResult[];
};

export type ScenePathsType = {
  screenshot: string | null;
  preview: string | null;
  stream: string | null;
  webp: string | null;
  vtt: string | null;
  sprite: string | null;
  funscript: string | null;
  interactive_heatmap: string | null;
  caption: string | null;
};

export type SceneStreamEndpoint = {
  url: string;
  mime_type: string | null;
  label: string | null;
};

export type SceneUpdateInput = {
  clientMutationId?: string | null;
  id: string;
  title?: string | null;
  code?: string | null;
  details?: string | null;
  director?: string | null;
  /** @deprecated Use urls */
  url?: string | null;
  urls?: string[] | null;
  date?: string | null;
  rating100?: number | null;
  /** @deprecated Unsupported - Use sceneIncrementO/sceneDecrementO */
  o_counter?: number | null;
  organized?: boolean | null;
  studio_id?: string | null;
  gallery_ids?: string[] | null;
  performer_ids?: string[] | null;
  groups?: SceneGroupInput[] | null;
  /** @deprecated Use groups */
  movies?: SceneMovieInput[] | null;
  tag_ids?: string[] | null;
  /** This should be a URL or a base64 encoded data URL */
  cover_image?: string | null;
  stash_ids?: StashIDInput[] | null;
  /** The time index a scene was left at */
  resume_time?: number | null;
  /** The total time a scene has spent playing */
  play_duration?: number | null;
  /**
   * The number ot times a scene has been played
   *
   * @deprecated Unsupported - Use sceneIncrementPlayCount/sceneDecrementPlayCount
   */
  play_count?: number | null;
  primary_file_id?: string | null;
  custom_fields?: CustomFieldsInput | null;
};

export type ScenesDestroyInput = {
  ids: string[];
  delete_file?: boolean | null;
  delete_generated?: boolean | null;
  /** If true, delete the file entry from the database if the file is not assigned to any other objects */
  destroy_file_entry?: boolean | null;
};

/** Type of the content a scraper generates */
export type ScrapeContentType =
  | 'GALLERY'
  | 'IMAGE'
  | 'MOVIE'
  | 'GROUP'
  | 'PERFORMER'
  | 'SCENE';

export type ScrapeMultiPerformersInput = {
  /** Instructs to query by scene fingerprints */
  performer_ids?: string[] | null;
};

export type ScrapeMultiScenesInput = {
  /** Instructs to query by scene fingerprints */
  scene_ids?: string[] | null;
};

export type ScrapeSingleGalleryInput = {
  /** Instructs to query by string */
  query?: string | null;
  /** Instructs to query by gallery id */
  gallery_id?: string | null;
  /** Instructs to query by gallery fragment */
  gallery_input?: ScrapedGalleryInput | null;
};

export type ScrapeSingleGroupInput = {
  /** Instructs to query by string */
  query?: string | null;
  /** Instructs to query by group id */
  group_id?: string | null;
  /** Instructs to query by group fragment */
  group_input?: ScrapedGroupInput | null;
};

export type ScrapeSingleImageInput = {
  /** Instructs to query by string */
  query?: string | null;
  /** Instructs to query by image id */
  image_id?: string | null;
  /** Instructs to query by image fragment */
  image_input?: ScrapedImageInput | null;
};

export type ScrapeSingleMovieInput = {
  /** Instructs to query by string */
  query?: string | null;
  /** Instructs to query by movie id */
  movie_id?: string | null;
  /** Instructs to query by movie fragment */
  movie_input?: ScrapedMovieInput | null;
};

export type ScrapeSinglePerformerInput = {
  /** Instructs to query by string */
  query?: string | null;
  /** Instructs to query by performer id */
  performer_id?: string | null;
  /** Instructs to query by performer fragment */
  performer_input?: ScrapedPerformerInput | null;
};

export type ScrapeSingleSceneInput = {
  /** Instructs to query by string */
  query?: string | null;
  /** Instructs to query by scene fingerprints */
  scene_id?: string | null;
  /** Instructs to query by scene fragment */
  scene_input?: ScrapedSceneInput | null;
};

export type ScrapeSingleStudioInput = {
  /** Query can be either a name or a Stash ID */
  query?: string | null;
};

export type ScrapeSingleTagInput = {
  /** Query can be either a name or a Stash ID */
  query?: string | null;
};

export type ScrapeType =
  /** From text query */
  | 'NAME'
  /** From existing object */
  | 'FRAGMENT'
  /** From URL */
  | 'URL';

/** Scraped Content is the forming union over the different scrapers */
export type ScrapedContent = ScrapedStudio | ScrapedTag | ScrapedScene | ScrapedGallery | ScrapedImage | ScrapedMovie | ScrapedGroup | ScrapedPerformer;

export type ScrapedGallery = {
  title: string | null;
  code: string | null;
  details: string | null;
  photographer: string | null;
  /** @deprecated use urls */
  url: string | null;
  urls: string[] | null;
  date: string | null;
  studio: ScrapedStudio | null;
  tags: ScrapedTag[] | null;
  performers: ScrapedPerformer[] | null;
};

export type ScrapedGalleryInput = {
  title?: string | null;
  code?: string | null;
  details?: string | null;
  photographer?: string | null;
  /** @deprecated use urls */
  url?: string | null;
  urls?: string[] | null;
  date?: string | null;
};

/** A group from a scraping operation... */
export type ScrapedGroup = {
  stored_id: string | null;
  name: string | null;
  aliases: string | null;
  duration: string | null;
  date: string | null;
  rating: string | null;
  director: string | null;
  urls: string[] | null;
  synopsis: string | null;
  studio: ScrapedStudio | null;
  tags: ScrapedTag[] | null;
  /** This should be a base64 encoded data URL */
  front_image: string | null;
  /** This should be a base64 encoded data URL */
  back_image: string | null;
};

export type ScrapedGroupInput = {
  name?: string | null;
  aliases?: string | null;
  duration?: string | null;
  date?: string | null;
  rating?: string | null;
  director?: string | null;
  urls?: string[] | null;
  synopsis?: string | null;
};

export type ScrapedImage = {
  title: string | null;
  code: string | null;
  details: string | null;
  photographer: string | null;
  urls: string[] | null;
  date: string | null;
  studio: ScrapedStudio | null;
  tags: ScrapedTag[] | null;
  performers: ScrapedPerformer[] | null;
};

export type ScrapedImageInput = {
  title?: string | null;
  code?: string | null;
  details?: string | null;
  urls?: string[] | null;
  date?: string | null;
};

/** A movie from a scraping operation... */
export type ScrapedMovie = {
  stored_id: string | null;
  name: string | null;
  aliases: string | null;
  duration: string | null;
  date: string | null;
  rating: string | null;
  director: string | null;
  /** @deprecated use urls */
  url: string | null;
  urls: string[] | null;
  synopsis: string | null;
  studio: ScrapedStudio | null;
  tags: ScrapedTag[] | null;
  /** This should be a base64 encoded data URL */
  front_image: string | null;
  /** This should be a base64 encoded data URL */
  back_image: string | null;
};

export type ScrapedMovieInput = {
  name?: string | null;
  aliases?: string | null;
  duration?: string | null;
  date?: string | null;
  rating?: string | null;
  director?: string | null;
  /** @deprecated use urls */
  url?: string | null;
  urls?: string[] | null;
  synopsis?: string | null;
};

/** A performer from a scraping operation... */
export type ScrapedPerformer = {
  /** Set if performer matched */
  stored_id: string | null;
  name: string | null;
  disambiguation: string | null;
  gender: string | null;
  /** @deprecated use urls */
  url: string | null;
  urls: string[] | null;
  /** @deprecated use urls */
  twitter: string | null;
  /** @deprecated use urls */
  instagram: string | null;
  birthdate: string | null;
  ethnicity: string | null;
  country: string | null;
  eye_color: string | null;
  height: string | null;
  measurements: string | null;
  fake_tits: string | null;
  penis_length: string | null;
  circumcised: string | null;
  /** @deprecated Use career_start and career_end */
  career_length: string | null;
  career_start: string | null;
  career_end: string | null;
  tattoos: string | null;
  piercings: string | null;
  aliases: string | null;
  tags: ScrapedTag[] | null;
  /**
   * This should be a base64 encoded data URL
   *
   * @deprecated use images instead
   */
  image: string | null;
  images: string[] | null;
  details: string | null;
  death_date: string | null;
  hair_color: string | null;
  weight: string | null;
  remote_site_id: string | null;
};

export type ScrapedPerformerInput = {
  /** Set if performer matched */
  stored_id?: string | null;
  name?: string | null;
  disambiguation?: string | null;
  gender?: string | null;
  /** @deprecated use urls */
  url?: string | null;
  urls?: string[] | null;
  /** @deprecated use urls */
  twitter?: string | null;
  /** @deprecated use urls */
  instagram?: string | null;
  birthdate?: string | null;
  ethnicity?: string | null;
  country?: string | null;
  eye_color?: string | null;
  height?: string | null;
  measurements?: string | null;
  fake_tits?: string | null;
  penis_length?: string | null;
  circumcised?: string | null;
  /** @deprecated Use career_start and career_end */
  career_length?: string | null;
  career_start?: string | null;
  career_end?: string | null;
  tattoos?: string | null;
  piercings?: string | null;
  aliases?: string | null;
  details?: string | null;
  death_date?: string | null;
  hair_color?: string | null;
  weight?: string | null;
  remote_site_id?: string | null;
};

export type ScrapedScene = {
  title: string | null;
  code: string | null;
  details: string | null;
  director: string | null;
  /** @deprecated use urls */
  url: string | null;
  urls: string[] | null;
  date: string | null;
  /** This should be a base64 encoded data URL */
  image: string | null;
  file: SceneFileType | null;
  studio: ScrapedStudio | null;
  tags: ScrapedTag[] | null;
  performers: ScrapedPerformer[] | null;
  /** @deprecated use groups */
  movies: ScrapedMovie[] | null;
  groups: ScrapedGroup[] | null;
  remote_site_id: string | null;
  duration: number | null;
  fingerprints: StashBoxFingerprint[] | null;
};

export type ScrapedSceneInput = {
  title?: string | null;
  code?: string | null;
  details?: string | null;
  director?: string | null;
  /** @deprecated use urls */
  url?: string | null;
  urls?: string[] | null;
  date?: string | null;
  remote_site_id?: string | null;
};

export type ScrapedStudio = {
  /** Set if studio matched */
  stored_id: string | null;
  name: string;
  /** @deprecated use urls */
  url: string | null;
  urls: string[] | null;
  parent: ScrapedStudio | null;
  image: string | null;
  details: string | null;
  /** Aliases must be comma-delimited to be parsed correctly */
  aliases: string | null;
  tags: ScrapedTag[] | null;
  remote_site_id: string | null;
};

export type ScrapedTag = {
  /** Set if tag matched */
  stored_id: string | null;
  name: string;
  description: string | null;
  alias_list: string[] | null;
  parent: ScrapedTag | null;
  /** Remote site ID, if applicable */
  remote_site_id: string | null;
};

export type Scraper = {
  id: string;
  name: string;
  /** Details for performer scraper */
  performer: ScraperSpec | null;
  /** Details for scene scraper */
  scene: ScraperSpec | null;
  /** Details for gallery scraper */
  gallery: ScraperSpec | null;
  /** Details for image scraper */
  image: ScraperSpec | null;
  /**
   * Details for movie scraper
   *
   * @deprecated use group
   */
  movie: ScraperSpec | null;
  /** Details for group scraper */
  group: ScraperSpec | null;
};

export type ScraperSource = {
  /**
   * Index of the configured stash-box instance to use. Should be unset if scraper_id is set
   *
   * @deprecated use stash_box_endpoint
   */
  stash_box_index: number | null;
  /** Stash-box endpoint */
  stash_box_endpoint: string | null;
  /** Scraper ID to scrape with. Should be unset if stash_box_endpoint/stash_box_index is set */
  scraper_id: string | null;
};

export type ScraperSourceInput = {
  /**
   * Index of the configured stash-box instance to use. Should be unset if scraper_id is set
   *
   * @deprecated use stash_box_endpoint
   */
  stash_box_index?: number | null;
  /** Stash-box endpoint */
  stash_box_endpoint?: string | null;
  /** Scraper ID to scrape with. Should be unset if stash_box_endpoint/stash_box_index is set */
  scraper_id?: string | null;
};

export type ScraperSpec = {
  /** URLs matching these can be scraped with */
  urls: string[] | null;
  supported_scrapes: ScrapeType[];
};

export type SetDefaultFilterInput = {
  mode: FilterMode;
  /** null to clear */
  find_filter?: FindFilterType | null;
  object_filter?: Record<string, JsonValue> | null;
  ui_options?: Record<string, JsonValue> | null;
};

export type SetFingerprintsInput = {
  type: string;
  /** a null value will remove the fingerprint */
  value?: string | null;
};

export type SetupInput = {
  /** Empty to indicate $HOME/.stash/config.yml default */
  configLocation: string;
  stashes: StashConfigInput[];
  /** True if SFW content mode is enabled */
  sfwContentMode?: boolean | null;
  /** Empty to indicate default */
  databaseFile: string;
  /** Empty to indicate default */
  generatedLocation: string;
  /** Empty to indicate default */
  cacheLocation: string;
  storeBlobsInDatabase: boolean;
  /** Empty to indicate default - only applicable if storeBlobsInDatabase is false */
  blobsLocation: string;
};

export type SortDirectionEnum =
  | 'ASC'
  | 'DESC';

export type StashBox = {
  endpoint: string;
  api_key: string;
  name: string;
  max_requests_per_minute: number;
};

/**
 * Accepts either ids, or a combination of names and stash_ids.
 * If none are set, then all existing items will be tagged.
 */
export type StashBoxBatchTagInput = {
  /**
   * Stash endpoint to use for the tagging
   *
   * @deprecated use stash_box_endpoint
   */
  endpoint?: number | null;
  /** Endpoint of the stash-box instance to use */
  stash_box_endpoint?: string | null;
  /** Fields to exclude when executing the tagging */
  exclude_fields?: string[] | null;
  /** Refresh items already tagged by StashBox if true. Only tag items with no StashBox tagging if false */
  refresh: boolean;
  /** If batch adding studios, should their parent studios also be created? */
  createParent: boolean;
  /**
   * IDs in stash of the items to update.
   * If set, names and stash_ids fields will be ignored.
   */
  ids?: string[] | null;
  /** Names of the items in the stash-box instance to search for and create */
  names?: string[] | null;
  /** Stash IDs of the items in the stash-box instance to search for and create */
  stash_ids?: string[] | null;
  /**
   * IDs in stash of the performers to update
   *
   * @deprecated use ids
   */
  performer_ids?: string[] | null;
  /**
   * Names of the performers in the stash-box instance to search for and create
   *
   * @deprecated use names
   */
  performer_names?: string[] | null;
};

export type StashBoxDraftSubmissionInput = {
  id: string;
  /** @deprecated use stash_box_endpoint */
  stash_box_index?: number | null;
  stash_box_endpoint?: string | null;
};

export type StashBoxFingerprint = {
  algorithm: string;
  hash: string;
  duration: number;
};

export type StashBoxFingerprintSubmissionInput = {
  scene_ids: string[];
  /** @deprecated use stash_box_endpoint */
  stash_box_index?: number | null;
  stash_box_endpoint?: string | null;
};

export type StashBoxInput = {
  endpoint: string;
  api_key: string;
  name: string;
  max_requests_per_minute?: number | null;
};

export type StashBoxPerformerQueryInput = {
  /**
   * Index of the configured stash-box instance to use
   *
   * @deprecated use stash_box_endpoint
   */
  stash_box_index?: number | null;
  /** Endpoint of the stash-box instance to use */
  stash_box_endpoint?: string | null;
  /** Instructs query by scene fingerprints */
  performer_ids?: string[] | null;
  /** Query by query string */
  q?: string | null;
};

export type StashBoxPerformerQueryResult = {
  query: string;
  results: ScrapedPerformer[];
};

export type StashBoxSceneQueryInput = {
  /**
   * Index of the configured stash-box instance to use
   *
   * @deprecated use stash_box_endpoint
   */
  stash_box_index?: number | null;
  /** Endpoint of the stash-box instance to use */
  stash_box_endpoint?: string | null;
  /** Instructs query by scene fingerprints */
  scene_ids?: string[] | null;
  /** Query by query string */
  q?: string | null;
};

export type StashBoxValidationResult = {
  valid: boolean;
  status: string;
};

export type StashConfig = {
  path: string;
  excludeVideo: boolean;
  excludeImage: boolean;
};

/** Stash configuration details */
export type StashConfigInput = {
  path: string;
  excludeVideo: boolean;
  excludeImage: boolean;
};

export type StashID = {
  endpoint: string;
  stash_id: string;
  updated_at: string;
};

export type StashIDCriterionInput = {
  /**
   * If present, this value is treated as a predicate.
   * That is, it will filter based on stash_id with the matching endpoint
   */
  endpoint?: string | null;
  stash_id?: string | null;
  modifier: CriterionModifier;
};

export type StashIDInput = {
  endpoint: string;
  stash_id: string;
  updated_at?: string | null;
};

export type StashIDsCriterionInput = {
  /**
   * If present, this value is treated as a predicate.
   * That is, it will filter based on stash_ids with the matching endpoint
   */
  endpoint?: string | null;
  stash_ids?: (string | null)[] | null;
  modifier: CriterionModifier;
};

export type StatsResultType = {
  scene_count: number;
  scenes_size: number;
  scenes_duration: number;
  image_count: number;
  images_size: number;
  gallery_count: number;
  performer_count: number;
  studio_count: number;
  group_count: number;
  /** @deprecated use group_count instead */
  movie_count: number;
  tag_count: number;
  total_o_count: number;
  total_play_duration: number;
  total_play_count: number;
  scenes_played: number;
};

export type StreamingResolutionEnum =
  /** 240p */
  | 'LOW'
  /** 480p */
  | 'STANDARD'
  /** 720p */
  | 'STANDARD_HD'
  /** 1080p */
  | 'FULL_HD'
  /** 4k */
  | 'FOUR_K'
  /** Original */
  | 'ORIGINAL';

export type StringCriterionInput = {
  value: string;
  modifier: CriterionModifier;
};

export type Studio = {
  id: string;
  name: string;
  /** @deprecated Use urls */
  url: string | null;
  urls: string[];
  parent_studio: Studio | null;
  child_studios: Studio[];
  aliases: string[];
  tags: Tag[];
  ignore_auto_tag: boolean;
  organized: boolean;
  image_path: string | null;
  scene_count: number;
  image_count: number;
  gallery_count: number;
  performer_count: number;
  group_count: number;
  /** @deprecated use group_count instead */
  movie_count: number;
  stash_ids: StashID[];
  rating100: number | null;
  favorite: boolean;
  details: string | null;
  created_at: string;
  updated_at: string;
  groups: Group[];
  /** @deprecated use groups instead */
  movies: Movie[];
  o_counter: number | null;
  custom_fields: Record<string, JsonValue>;
};

export type StudioCreateInput = {
  name: string;
  /** @deprecated Use urls */
  url?: string | null;
  urls?: string[] | null;
  parent_id?: string | null;
  /** This should be a URL or a base64 encoded data URL */
  image?: string | null;
  stash_ids?: StashIDInput[] | null;
  rating100?: number | null;
  favorite?: boolean | null;
  details?: string | null;
  /** Duplicate aliases and those equal to name will be ignored (case-insensitive) */
  aliases?: string[] | null;
  tag_ids?: string[] | null;
  ignore_auto_tag?: boolean | null;
  organized?: boolean | null;
  custom_fields?: Record<string, JsonValue> | null;
};

export type StudioDestroyInput = {
  id: string;
};

export type StudioFilterType = {
  AND?: StudioFilterType | null;
  OR?: StudioFilterType | null;
  NOT?: StudioFilterType | null;
  name?: StringCriterionInput | null;
  details?: StringCriterionInput | null;
  /** Filter to only include studios with this parent studio */
  parents?: MultiCriterionInput | null;
  /**
   * Filter by StashID
   *
   * @deprecated use stash_ids_endpoint instead
   */
  stash_id_endpoint?: StashIDCriterionInput | null;
  /** Filter by StashIDs */
  stash_ids_endpoint?: StashIDsCriterionInput | null;
  /** Filter to only include studios with these tags */
  tags?: HierarchicalMultiCriterionInput | null;
  /** Filter to only include studios missing this property */
  is_missing?: string | null;
  rating100?: IntCriterionInput | null;
  /** Filter by favorite */
  favorite?: boolean | null;
  /** Filter by scene count */
  scene_count?: IntCriterionInput | null;
  /** Filter by image count */
  image_count?: IntCriterionInput | null;
  /** Filter by gallery count */
  gallery_count?: IntCriterionInput | null;
  /** Filter by group count */
  group_count?: IntCriterionInput | null;
  /** Filter by tag count */
  tag_count?: IntCriterionInput | null;
  /** Filter by url */
  url?: StringCriterionInput | null;
  /** Filter by studio aliases */
  aliases?: StringCriterionInput | null;
  /** Filter by subsidiary studio count */
  child_count?: IntCriterionInput | null;
  /** Filter by autotag ignore value */
  ignore_auto_tag?: boolean | null;
  /** Filter by organized */
  organized?: boolean | null;
  /** Filter by related scenes that meet this criteria */
  scenes_filter?: SceneFilterType | null;
  /** Filter by related images that meet this criteria */
  images_filter?: ImageFilterType | null;
  /** Filter by related galleries that meet this criteria */
  galleries_filter?: GalleryFilterType | null;
  /** Filter by related groups that meet this criteria */
  groups_filter?: GroupFilterType | null;
  /** Filter by creation time */
  created_at?: TimestampCriterionInput | null;
  /** Filter by last update time */
  updated_at?: TimestampCriterionInput | null;
  custom_fields?: CustomFieldCriterionInput[] | null;
};

export type StudioUpdateInput = {
  id: string;
  name?: string | null;
  /** @deprecated Use urls */
  url?: string | null;
  urls?: string[] | null;
  parent_id?: string | null;
  /** This should be a URL or a base64 encoded data URL */
  image?: string | null;
  stash_ids?: StashIDInput[] | null;
  rating100?: number | null;
  favorite?: boolean | null;
  details?: string | null;
  /** Duplicate aliases and those equal to name will be ignored (case-insensitive) */
  aliases?: string[] | null;
  tag_ids?: string[] | null;
  ignore_auto_tag?: boolean | null;
  organized?: boolean | null;
  custom_fields?: CustomFieldsInput | null;
};

export type SystemStatus = {
  databaseSchema: number | null;
  databasePath: string | null;
  configPath: string | null;
  appSchema: number;
  status: SystemStatusEnum;
  os: string;
  workingDir: string;
  homeDir: string;
  ffmpegPath: string | null;
  ffprobePath: string | null;
};

export type SystemStatusEnum =
  | 'SETUP'
  | 'NEEDS_MIGRATION'
  | 'OK';

export type Tag = {
  id: string;
  name: string;
  /** Value that does not appear in the UI but overrides name for sorting */
  sort_name: string | null;
  description: string | null;
  aliases: string[];
  ignore_auto_tag: boolean;
  created_at: string;
  updated_at: string;
  favorite: boolean;
  stash_ids: StashID[];
  image_path: string | null;
  scene_count: number;
  scene_marker_count: number;
  image_count: number;
  gallery_count: number;
  performer_count: number;
  studio_count: number;
  group_count: number;
  /** @deprecated use group_count instead */
  movie_count: number;
  parents: Tag[];
  children: Tag[];
  parent_count: number;
  child_count: number;
  custom_fields: Record<string, JsonValue>;
};

export type TagCreateInput = {
  name: string;
  /** Value that does not appear in the UI but overrides name for sorting */
  sort_name?: string | null;
  description?: string | null;
  /** Duplicate aliases and those equal to name will be ignored (case-insensitive) */
  aliases?: string[] | null;
  ignore_auto_tag?: boolean | null;
  favorite?: boolean | null;
  /** This should be a URL or a base64 encoded data URL */
  image?: string | null;
  stash_ids?: StashIDInput[] | null;
  parent_ids?: string[] | null;
  child_ids?: string[] | null;
  custom_fields?: Record<string, JsonValue> | null;
};

export type TagDestroyInput = {
  id: string;
};

export type TagFilterType = {
  AND?: TagFilterType | null;
  OR?: TagFilterType | null;
  NOT?: TagFilterType | null;
  /** Filter by tag name */
  name?: StringCriterionInput | null;
  /** Filter by tag sort_name */
  sort_name?: StringCriterionInput | null;
  /** Filter by tag aliases */
  aliases?: StringCriterionInput | null;
  /** Filter by favorite */
  favorite?: boolean | null;
  /** Filter by tag description */
  description?: StringCriterionInput | null;
  /** Filter to only include tags missing this property */
  is_missing?: string | null;
  /** Filter by number of scenes with this tag */
  scene_count?: IntCriterionInput | null;
  /** Filter by number of images with this tag */
  image_count?: IntCriterionInput | null;
  /** Filter by number of galleries with this tag */
  gallery_count?: IntCriterionInput | null;
  /** Filter by number of performers with this tag */
  performer_count?: IntCriterionInput | null;
  /** Filter by number of studios with this tag */
  studio_count?: IntCriterionInput | null;
  /** Filter by number of movies with this tag */
  movie_count?: IntCriterionInput | null;
  /** Filter by number of group with this tag */
  group_count?: IntCriterionInput | null;
  /** Filter by number of markers with this tag */
  marker_count?: IntCriterionInput | null;
  /** Filter by parent tags */
  parents?: HierarchicalMultiCriterionInput | null;
  /** Filter by child tags */
  children?: HierarchicalMultiCriterionInput | null;
  /** Filter by number of parent tags the tag has */
  parent_count?: IntCriterionInput | null;
  /** Filter by number of child tags the tag has */
  child_count?: IntCriterionInput | null;
  /** Filter by autotag ignore value */
  ignore_auto_tag?: boolean | null;
  /**
   * Filter by StashID
   *
   * @deprecated use stash_ids_endpoint instead
   */
  stash_id_endpoint?: StashIDCriterionInput | null;
  /** Filter by StashID */
  stash_ids_endpoint?: StashIDsCriterionInput | null;
  /** Filter by related scenes that meet this criteria */
  scenes_filter?: SceneFilterType | null;
  /** Filter by related images that meet this criteria */
  images_filter?: ImageFilterType | null;
  /** Filter by related galleries that meet this criteria */
  galleries_filter?: GalleryFilterType | null;
  /** Filter by related groups that meet this criteria */
  groups_filter?: GroupFilterType | null;
  /** Filter by related performers that meet this criteria */
  performers_filter?: PerformerFilterType | null;
  /** Filter by related studios that meet this criteria */
  studios_filter?: StudioFilterType | null;
  /** Filter by related scene markers that meet this criteria */
  markers_filter?: SceneMarkerFilterType | null;
  /** Filter by creation time */
  created_at?: TimestampCriterionInput | null;
  /** Filter by last update time */
  updated_at?: TimestampCriterionInput | null;
  custom_fields?: CustomFieldCriterionInput[] | null;
};

export type TagUpdateInput = {
  id: string;
  name?: string | null;
  /** Value that does not appear in the UI but overrides name for sorting */
  sort_name?: string | null;
  description?: string | null;
  /** Duplicate aliases and those equal to name will be ignored (case-insensitive) */
  aliases?: string[] | null;
  ignore_auto_tag?: boolean | null;
  favorite?: boolean | null;
  /** This should be a URL or a base64 encoded data URL */
  image?: string | null;
  stash_ids?: StashIDInput[] | null;
  parent_ids?: string[] | null;
  child_ids?: string[] | null;
  custom_fields?: CustomFieldsInput | null;
};

export type TagsMergeInput = {
  source: string[];
  destination: string;
  values?: TagUpdateInput | null;
};

export type TimestampCriterionInput = {
  value: string;
  value2?: string | null;
  modifier: CriterionModifier;
};

export type Version = {
  version: string | null;
  hash: string;
  build_time: string;
};

export type VideoCaption = {
  language_code: string;
  caption_type: string;
};

export type VideoFile = {
  id: string;
  path: string;
  basename: string;
  /** @deprecated Use parent_folder instead */
  parent_folder_id: string;
  /** @deprecated Use zip_file instead */
  zip_file_id: string | null;
  parent_folder: Folder;
  zip_file: BasicFile | null;
  mod_time: string;
  size: number;
  fingerprint: string | null;
  fingerprints: Fingerprint[];
  format: string;
  width: number;
  height: number;
  duration: number;
  video_codec: string;
  audio_codec: string;
  frame_rate: number;
  bit_rate: number;
  created_at: string;
  updated_at: string;
};

export type VideoFileFilterInput = {
  resolution?: ResolutionCriterionInput | null;
  orientation?: OrientationCriterionInput | null;
  framerate?: IntCriterionInput | null;
  bitrate?: IntCriterionInput | null;
  format?: StringCriterionInput | null;
  video_codec?: StringCriterionInput | null;
  audio_codec?: StringCriterionInput | null;
  /** in seconds */
  duration?: IntCriterionInput | null;
  captions?: StringCriterionInput | null;
  interactive?: boolean | null;
  interactive_speed?: IntCriterionInput | null;
};

export type VisualFile = VideoFile | ImageFile;

export type Queries = {
  findSavedFilter: { args: { id: string }; result: SavedFilter | null };
  findSavedFilters: { args: { mode?: FilterMode | null }; result: SavedFilter[] };
  /** @deprecated default filter now stored in UI config */
  findDefaultFilter: { args: { mode: FilterMode }; result: SavedFilter | null };
  /** Find a file by its id or path */
  findFile: { args: { id?: string | null; path?: string | null }; result: BaseFile };
  /** Queries for Files */
  findFiles: { args: { file_filter?: FileFilterType | null; filter?: FindFilterType | null; ids?: string[] | null }; result: FindFilesResultType };
  /** Find a file by its id or path */
  findFolder: { args: { id?: string | null; path?: string | null }; result: Folder };
  /** Queries for Files */
  findFolders: { args: { folder_filter?: FolderFilterType | null; filter?: FindFilterType | null; ids?: string[] | null }; result: FindFoldersResultType };
  /** Find a scene by ID or Checksum */
  findScene: { args: { id?: string | null; checksum?: string | null }; result: Scene | null };
  findSceneByHash: { args: { input: SceneHashInput }; result: Scene | null };
  /** A function which queries Scene objects */
  findScenes: { args: { scene_filter?: SceneFilterType | null; scene_ids?: number[] | null; ids?: string[] | null; filter?: FindFilterType | null }; result: FindScenesResultType };
  findScenesByPathRegex: { args: { filter?: FindFilterType | null }; result: FindScenesResultType };
  /**
   * Returns any groups of scenes that are perceptual duplicates within the queried distance
   * and the difference between their duration is smaller than durationDiff
   */
  findDuplicateScenes: { args: { distance?: number | null; duration_diff?: number | null }; result: Scene[][] };
  /** Return valid stream paths */
  sceneStreams: { args: { id?: string | null }; result: SceneStreamEndpoint[] };
  parseSceneFilenames: { args: { filter?: FindFilterType | null; config: SceneParserInput }; result: SceneParserResultType };
  /** A function which queries SceneMarker objects */
  findSceneMarkers: { args: { scene_marker_filter?: SceneMarkerFilterType | null; filter?: FindFilterType | null; ids?: string[] | null }; result: FindSceneMarkersResultType };
  findImage: { args: { id?: string | null; checksum?: string | null }; result: Image | null };
  /** A function which queries Scene objects */
  findImages: { args: { image_filter?: ImageFilterType | null; image_ids?: number[] | null; ids?: string[] | null; filter?: FindFilterType | null }; result: FindImagesResultType };
  /** Find a performer by ID */
  findPerformer: { args: { id: string }; result: Performer | null };
  /** A function which queries Performer objects */
  findPerformers: { args: { performer_filter?: PerformerFilterType | null; filter?: FindFilterType | null; performer_ids?: number[] | null; ids?: string[] | null }; result: FindPerformersResultType };
  /** Find a studio by ID */
  findStudio: { args: { id: string }; result: Studio | null };
  /** A function which queries Studio objects */
  findStudios: { args: { studio_filter?: StudioFilterType | null; filter?: FindFilterType | null; ids?: string[] | null }; result: FindStudiosResultType };
  /**
   * Find a movie by ID
   *
   * @deprecated Use findGroup instead
   */
  findMovie: { args: { id: string }; result: Movie | null };
  /**
   * A function which queries Movie objects
   *
   * @deprecated Use findGroups instead
   */
  findMovies: { args: { movie_filter?: MovieFilterType | null; filter?: FindFilterType | null; ids?: string[] | null }; result: FindMoviesResultType };
  /** Find a group by ID */
  findGroup: { args: { id: string }; result: Group | null };
  /** A function which queries Group objects */
  findGroups: { args: { group_filter?: GroupFilterType | null; filter?: FindFilterType | null; ids?: string[] | null }; result: FindGroupsResultType };
  findGallery: { args: { id: string }; result: Gallery | null };
  findGalleries: { args: { gallery_filter?: GalleryFilterType | null; filter?: FindFilterType | null; ids?: string[] | null }; result: FindGalleriesResultType };
  findTag: { args: { id: string }; result: Tag | null };
  findTags: { args: { tag_filter?: TagFilterType | null; filter?: FindFilterType | null; ids?: string[] | null }; result: FindTagsResultType };
  /** Retrieve random scene markers for the wall */
  markerWall: { args: { q?: string | null }; result: SceneMarker[] };
  /** Retrieve random scenes for the wall */
  sceneWall: { args: { q?: string | null }; result: Scene[] };
  /** Get marker strings */
  markerStrings: { args: { q?: string | null; sort?: string | null }; result: (MarkerStringsResultType | null)[] };
  /** Get stats */
  stats: { args: Record<string, never>; result: StatsResultType };
  /** Organize scene markers by tag for a given scene ID */
  sceneMarkerTags: { args: { scene_id: string }; result: SceneMarkerTag[] };
  logs: { args: Record<string, never>; result: LogEntry[] };
  /** List available scrapers */
  listScrapers: { args: { types: ScrapeContentType[] }; result: Scraper[] };
  /** Scrape for a single scene */
  scrapeSingleScene: { args: { source: ScraperSourceInput; input: ScrapeSingleSceneInput }; result: ScrapedScene[] };
  /** Scrape for multiple scenes */
  scrapeMultiScenes: { args: { source: ScraperSourceInput; input: ScrapeMultiScenesInput }; result: ScrapedScene[][] };
  /** Scrape for a single studio */
  scrapeSingleStudio: { args: { source: ScraperSourceInput; input: ScrapeSingleStudioInput }; result: ScrapedStudio[] };
  /** Scrape for a single tag */
  scrapeSingleTag: { args: { source: ScraperSourceInput; input: ScrapeSingleTagInput }; result: ScrapedTag[] };
  /** Scrape for a single performer */
  scrapeSinglePerformer: { args: { source: ScraperSourceInput; input: ScrapeSinglePerformerInput }; result: ScrapedPerformer[] };
  /** Scrape for multiple performers */
  scrapeMultiPerformers: { args: { source: ScraperSourceInput; input: ScrapeMultiPerformersInput }; result: ScrapedPerformer[][] };
  /** Scrape for a single gallery */
  scrapeSingleGallery: { args: { source: ScraperSourceInput; input: ScrapeSingleGalleryInput }; result: ScrapedGallery[] };
  /**
   * Scrape for a single movie
   *
   * @deprecated Use scrapeSingleGroup instead
   */
  scrapeSingleMovie: { args: { source: ScraperSourceInput; input: ScrapeSingleMovieInput }; result: ScrapedMovie[] };
  /** Scrape for a single group */
  scrapeSingleGroup: { args: { source: ScraperSourceInput; input: ScrapeSingleGroupInput }; result: ScrapedGroup[] };
  /** Scrape for a single image */
  scrapeSingleImage: { args: { source: ScraperSourceInput; input: ScrapeSingleImageInput }; result: ScrapedImage[] };
  /** Scrapes content based on a URL */
  scrapeURL: { args: { url: string; ty: ScrapeContentType }; result: ScrapedContent | null };
  /** Scrapes a complete performer record based on a URL */
  scrapePerformerURL: { args: { url: string }; result: ScrapedPerformer | null };
  /** Scrapes a complete scene record based on a URL */
  scrapeSceneURL: { args: { url: string }; result: ScrapedScene | null };
  /** Scrapes a complete gallery record based on a URL */
  scrapeGalleryURL: { args: { url: string }; result: ScrapedGallery | null };
  /** Scrapes a complete image record based on a URL */
  scrapeImageURL: { args: { url: string }; result: ScrapedImage | null };
  /**
   * Scrapes a complete movie record based on a URL
   *
   * @deprecated Use scrapeGroupURL instead
   */
  scrapeMovieURL: { args: { url: string }; result: ScrapedMovie | null };
  /** Scrapes a complete group record based on a URL */
  scrapeGroupURL: { args: { url: string }; result: ScrapedGroup | null };
  /** List loaded plugins */
  plugins: { args: Record<string, never>; result: Plugin[] | null };
  /** List available plugin operations */
  pluginTasks: { args: Record<string, never>; result: PluginTask[] | null };
  /** List installed packages */
  installedPackages: { args: { type: PackageType }; result: Package[] };
  /** List available packages */
  availablePackages: { args: { type: PackageType; source: string }; result: Package[] };
  /** Returns the current, complete configuration */
  configuration: { args: Record<string, never>; result: ConfigResult };
  /** Returns an array of paths for the given path */
  directory: { args: { path?: string | null; locale?: string | null }; result: Directory };
  validateStashBoxCredentials: { args: { input: StashBoxInput }; result: StashBoxValidationResult };
  systemStatus: { args: Record<string, never>; result: SystemStatus };
  jobQueue: { args: Record<string, never>; result: Job[] | null };
  findJob: { args: { input: FindJobInput }; result: Job | null };
  dlnaStatus: { args: Record<string, never>; result: DLNAStatus };
  /** @deprecated Use findScenes instead */
  allScenes: { args: Record<string, never>; result: Scene[] };
  /** @deprecated Use findSceneMarkers instead */
  allSceneMarkers: { args: Record<string, never>; result: SceneMarker[] };
  /** @deprecated Use findImages instead */
  allImages: { args: Record<string, never>; result: Image[] };
  /** @deprecated Use findGalleries instead */
  allGalleries: { args: Record<string, never>; result: Gallery[] };
  allPerformers: { args: Record<string, never>; result: Performer[] };
  /** @deprecated Use findTags instead */
  allTags: { args: Record<string, never>; result: Tag[] };
  /** @deprecated Use findStudios instead */
  allStudios: { args: Record<string, never>; result: Studio[] };
  /** @deprecated Use findGroups instead */
  allMovies: { args: Record<string, never>; result: Movie[] };
  version: { args: Record<string, never>; result: Version };
  latestversion: { args: Record<string, never>; result: LatestVersion };
};

export type Mutations = {
  setup: { args: { input: SetupInput }; result: boolean };
  /** Migrates the schema to the required version. Returns the job ID */
  migrate: { args: { input: MigrateInput }; result: string };
  /** Downloads and installs ffmpeg and ffprobe binaries into the configuration directory. Returns the job ID. */
  downloadFFMpeg: { args: Record<string, never>; result: string };
  sceneCreate: { args: { input: SceneCreateInput }; result: Scene | null };
  sceneUpdate: { args: { input: SceneUpdateInput }; result: Scene | null };
  sceneMerge: { args: { input: SceneMergeInput }; result: Scene | null };
  bulkSceneUpdate: { args: { input: BulkSceneUpdateInput }; result: Scene[] | null };
  sceneDestroy: { args: { input: SceneDestroyInput }; result: boolean };
  scenesDestroy: { args: { input: ScenesDestroyInput }; result: boolean };
  scenesUpdate: { args: { input: SceneUpdateInput[] }; result: (Scene | null)[] | null };
  /**
   * Increments the o-counter for a scene. Returns the new value
   *
   * @deprecated Use sceneAddO instead
   */
  sceneIncrementO: { args: { id: string }; result: number };
  /**
   * Decrements the o-counter for a scene. Returns the new value
   *
   * @deprecated Use sceneRemoveO instead
   */
  sceneDecrementO: { args: { id: string }; result: number };
  /** Increments the o-counter for a scene. Uses the current time if none provided. */
  sceneAddO: { args: { id: string; times?: string[] | null }; result: HistoryMutationResult };
  /** Decrements the o-counter for a scene, removing the last recorded time if specific time not provided. Returns the new value */
  sceneDeleteO: { args: { id: string; times?: string[] | null }; result: HistoryMutationResult };
  /** Resets the o-counter for a scene to 0. Returns the new value */
  sceneResetO: { args: { id: string }; result: number };
  /** Sets the resume time point (if provided) and adds the provided duration to the scene's play duration */
  sceneSaveActivity: { args: { id: string; resume_time?: number | null; playDuration?: number | null }; result: boolean };
  /** Resets the resume time point and play duration */
  sceneResetActivity: { args: { id: string; reset_resume?: boolean | null; reset_duration?: boolean | null }; result: boolean };
  /**
   * Increments the play count for the scene. Returns the new play count value.
   *
   * @deprecated Use sceneAddPlay instead
   */
  sceneIncrementPlayCount: { args: { id: string }; result: number };
  /** Increments the play count for the scene. Uses the current time if none provided. */
  sceneAddPlay: { args: { id: string; times?: string[] | null }; result: HistoryMutationResult };
  /** Decrements the play count for the scene, removing the specific times or the last recorded time if not provided. */
  sceneDeletePlay: { args: { id: string; times?: string[] | null }; result: HistoryMutationResult };
  /** Resets the play count for a scene to 0. Returns the new play count value. */
  sceneResetPlayCount: { args: { id: string }; result: number };
  /** Generates screenshot at specified time in seconds. Leave empty to generate default screenshot */
  sceneGenerateScreenshot: { args: { id: string; at?: number | null }; result: string };
  sceneMarkerCreate: { args: { input: SceneMarkerCreateInput }; result: SceneMarker | null };
  sceneMarkerUpdate: { args: { input: SceneMarkerUpdateInput }; result: SceneMarker | null };
  bulkSceneMarkerUpdate: { args: { input: BulkSceneMarkerUpdateInput }; result: SceneMarker[] | null };
  sceneMarkerDestroy: { args: { id: string }; result: boolean };
  sceneMarkersDestroy: { args: { ids: string[] }; result: boolean };
  sceneAssignFile: { args: { input: AssignSceneFileInput }; result: boolean };
  imageUpdate: { args: { input: ImageUpdateInput }; result: Image | null };
  bulkImageUpdate: { args: { input: BulkImageUpdateInput }; result: Image[] | null };
  imageDestroy: { args: { input: ImageDestroyInput }; result: boolean };
  imagesDestroy: { args: { input: ImagesDestroyInput }; result: boolean };
  imagesUpdate: { args: { input: ImageUpdateInput[] }; result: (Image | null)[] | null };
  /** Increments the o-counter for an image. Returns the new value */
  imageIncrementO: { args: { id: string }; result: number };
  /** Decrements the o-counter for an image. Returns the new value */
  imageDecrementO: { args: { id: string }; result: number };
  /** Resets the o-counter for a image to 0. Returns the new value */
  imageResetO: { args: { id: string }; result: number };
  galleryCreate: { args: { input: GalleryCreateInput }; result: Gallery | null };
  galleryUpdate: { args: { input: GalleryUpdateInput }; result: Gallery | null };
  bulkGalleryUpdate: { args: { input: BulkGalleryUpdateInput }; result: Gallery[] | null };
  galleryDestroy: { args: { input: GalleryDestroyInput }; result: boolean };
  galleriesUpdate: { args: { input: GalleryUpdateInput[] }; result: (Gallery | null)[] | null };
  addGalleryImages: { args: { input: GalleryAddInput }; result: boolean };
  removeGalleryImages: { args: { input: GalleryRemoveInput }; result: boolean };
  setGalleryCover: { args: { input: GallerySetCoverInput }; result: boolean };
  resetGalleryCover: { args: { input: GalleryResetCoverInput }; result: boolean };
  galleryChapterCreate: { args: { input: GalleryChapterCreateInput }; result: GalleryChapter | null };
  galleryChapterUpdate: { args: { input: GalleryChapterUpdateInput }; result: GalleryChapter | null };
  galleryChapterDestroy: { args: { id: string }; result: boolean };
  performerCreate: { args: { input: PerformerCreateInput }; result: Performer | null };
  performerUpdate: { args: { input: PerformerUpdateInput }; result: Performer | null };
  performerDestroy: { args: { input: PerformerDestroyInput }; result: boolean };
  performersDestroy: { args: { ids: string[] }; result: boolean };
  bulkPerformerUpdate: { args: { input: BulkPerformerUpdateInput }; result: Performer[] | null };
  performerMerge: { args: { input: PerformerMergeInput }; result: Performer };
  studioCreate: { args: { input: StudioCreateInput }; result: Studio | null };
  studioUpdate: { args: { input: StudioUpdateInput }; result: Studio | null };
  studioDestroy: { args: { input: StudioDestroyInput }; result: boolean };
  studiosDestroy: { args: { ids: string[] }; result: boolean };
  bulkStudioUpdate: { args: { input: BulkStudioUpdateInput }; result: Studio[] | null };
  /** @deprecated Use groupCreate instead */
  movieCreate: { args: { input: MovieCreateInput }; result: Movie | null };
  /** @deprecated Use groupUpdate instead */
  movieUpdate: { args: { input: MovieUpdateInput }; result: Movie | null };
  /** @deprecated Use groupDestroy instead */
  movieDestroy: { args: { input: MovieDestroyInput }; result: boolean };
  /** @deprecated Use groupsDestroy instead */
  moviesDestroy: { args: { ids: string[] }; result: boolean };
  /** @deprecated Use bulkGroupUpdate instead */
  bulkMovieUpdate: { args: { input: BulkMovieUpdateInput }; result: Movie[] | null };
  groupCreate: { args: { input: GroupCreateInput }; result: Group | null };
  groupUpdate: { args: { input: GroupUpdateInput }; result: Group | null };
  groupDestroy: { args: { input: GroupDestroyInput }; result: boolean };
  groupsDestroy: { args: { ids: string[] }; result: boolean };
  bulkGroupUpdate: { args: { input: BulkGroupUpdateInput }; result: Group[] | null };
  addGroupSubGroups: { args: { input: GroupSubGroupAddInput }; result: boolean };
  removeGroupSubGroups: { args: { input: GroupSubGroupRemoveInput }; result: boolean };
  /** Reorder sub groups within a group. Returns true if successful. */
  reorderSubGroups: { args: { input: ReorderSubGroupsInput }; result: boolean };
  tagCreate: { args: { input: TagCreateInput }; result: Tag | null };
  tagUpdate: { args: { input: TagUpdateInput }; result: Tag | null };
  tagDestroy: { args: { input: TagDestroyInput }; result: boolean };
  tagsDestroy: { args: { ids: string[] }; result: boolean };
  tagsMerge: { args: { input: TagsMergeInput }; result: Tag | null };
  bulkTagUpdate: { args: { input: BulkTagUpdateInput }; result: Tag[] | null };
  /**
   * Moves the given files to the given destination. Returns true if successful.
   * Either the destination_folder or destination_folder_id must be provided.
   * If both are provided, the destination_folder_id takes precedence.
   * Destination folder must be a subfolder of one of the stash library paths.
   * If provided, destination_basename must be a valid filename with an extension that
   * matches one of the media extensions.
   * Creates folder hierarchy if needed.
   */
  moveFiles: { args: { input: MoveFilesInput }; result: boolean };
  deleteFiles: { args: { ids: string[] }; result: boolean };
  /** Deletes file entries from the database without deleting the files from the filesystem */
  destroyFiles: { args: { ids: string[] }; result: boolean };
  fileSetFingerprints: { args: { input: FileSetFingerprintsInput }; result: boolean };
  /** Reveal the file in the system file manager */
  revealFileInFileManager: { args: { id: string }; result: boolean };
  /** Reveal the folder in the system file manager */
  revealFolderInFileManager: { args: { id: string }; result: boolean };
  saveFilter: { args: { input: SaveFilterInput }; result: SavedFilter };
  destroySavedFilter: { args: { input: DestroyFilterInput }; result: boolean };
  /** @deprecated now uses UI config */
  setDefaultFilter: { args: { input: SetDefaultFilterInput }; result: boolean };
  /** Change general configuration options */
  configureGeneral: { args: { input: ConfigGeneralInput }; result: ConfigGeneralResult };
  configureInterface: { args: { input: ConfigInterfaceInput }; result: ConfigInterfaceResult };
  configureDLNA: { args: { input: ConfigDLNAInput }; result: ConfigDLNAResult };
  configureScraping: { args: { input: ConfigScrapingInput }; result: ConfigScrapingResult };
  configureDefaults: { args: { input: ConfigDefaultSettingsInput }; result: ConfigDefaultSettingsResult };
  /** overwrites the entire plugin configuration for the given plugin */
  configurePlugin: { args: { plugin_id: string; input: Record<string, JsonValue> }; result: Record<string, JsonValue> };
  /**
   * overwrites the UI configuration
   * if input is provided, then the entire UI configuration is replaced
   * if partial is provided, then the partial UI configuration is merged into the existing UI configuration
   */
  configureUI: { args: { input?: Record<string, JsonValue> | null; partial?: Record<string, JsonValue> | null }; result: Record<string, JsonValue> };
  /**
   * sets a single UI key value
   * key is a dot separated path to the value
   */
  configureUISetting: { args: { key: string; value?: JsonValue | null }; result: Record<string, JsonValue> };
  /** Generate and set (or clear) API key */
  generateAPIKey: { args: { input: GenerateAPIKeyInput }; result: string };
  /** Returns a link to download the result */
  exportObjects: { args: { input: ExportObjectsInput }; result: string | null };
  /** Performs an incremental import. Returns the job ID */
  importObjects: { args: { input: ImportObjectsInput }; result: string };
  /** Start an full import. Completely wipes the database and imports from the metadata directory. Returns the job ID */
  metadataImport: { args: Record<string, never>; result: string };
  /** Start a full export. Outputs to the metadata directory. Returns the job ID */
  metadataExport: { args: Record<string, never>; result: string };
  /** Start a scan. Returns the job ID */
  metadataScan: { args: { input: ScanMetadataInput }; result: string };
  /** Start generating content. Returns the job ID */
  metadataGenerate: { args: { input: GenerateMetadataInput }; result: string };
  /** Start auto-tagging. Returns the job ID */
  metadataAutoTag: { args: { input: AutoTagMetadataInput }; result: string };
  /** Clean metadata. Returns the job ID */
  metadataClean: { args: { input: CleanMetadataInput }; result: string };
  /** Clean generated files. Returns the job ID */
  metadataCleanGenerated: { args: { input: CleanGeneratedInput }; result: string };
  /** Identifies scenes using scrapers. Returns the job ID */
  metadataIdentify: { args: { input: IdentifyMetadataInput }; result: string };
  /** Migrate generated files for the current hash naming */
  migrateHashNaming: { args: Record<string, never>; result: string };
  /** Migrates legacy scene screenshot files into the blob storage */
  migrateSceneScreenshots: { args: { input: MigrateSceneScreenshotsInput }; result: string };
  /** Migrates blobs from the old storage system to the current one */
  migrateBlobs: { args: { input: MigrateBlobsInput }; result: string };
  /** Anonymise the database in a separate file. Optionally returns a link to download the database file */
  anonymiseDatabase: { args: { input: AnonymiseDatabaseInput }; result: string | null };
  /** Optimises the database. Returns the job ID */
  optimiseDatabase: { args: Record<string, never>; result: string };
  /** Reload scrapers */
  reloadScrapers: { args: Record<string, never>; result: boolean };
  /**
   * Enable/disable plugins - enabledMap is a map of plugin IDs to enabled booleans.
   * Plugins not in the map are not affected.
   */
  setPluginsEnabled: { args: { enabledMap: Record<string, boolean> }; result: boolean };
  /**
   * Run a plugin task.
   * If task_name is provided, then the task must exist in the plugin config and the tasks configuration
   * will be used to run the plugin.
   * If no task_name is provided, then the plugin will be executed with the arguments provided only.
   * Returns the job ID
   */
  runPluginTask: { args: { plugin_id: string; task_name?: string | null; description?: string | null; args?: PluginArgInput[] | null; args_map?: Record<string, JsonValue> | null }; result: string };
  /**
   * Runs a plugin operation. The operation is run immediately and does not use the job queue.
   * Returns a map of the result.
   */
  runPluginOperation: { args: { plugin_id: string; args?: Record<string, JsonValue> | null }; result: JsonValue | null };
  reloadPlugins: { args: Record<string, never>; result: boolean };
  /**
   * Installs the given packages.
   * If a package is already installed, it will be updated if needed..
   * If an error occurs when installing a package, the job will continue to install the remaining packages.
   * Returns the job ID
   */
  installPackages: { args: { type: PackageType; packages: PackageSpecInput[] }; result: string };
  /**
   * Updates the given packages.
   * If a package is not installed, it will not be installed.
   * If a package does not need to be updated, it will not be updated.
   * If no packages are provided, all packages of the given type will be updated.
   * If an error occurs when updating a package, the job will continue to update the remaining packages.
   * Returns the job ID.
   */
  updatePackages: { args: { type: PackageType; packages?: PackageSpecInput[] | null }; result: string };
  /**
   * Uninstalls the given packages.
   * If an error occurs when uninstalling a package, the job will continue to uninstall the remaining packages.
   * Returns the job ID
   */
  uninstallPackages: { args: { type: PackageType; packages: PackageSpecInput[] }; result: string };
  stopJob: { args: { job_id: string }; result: boolean };
  stopAllJobs: { args: Record<string, never>; result: boolean };
  /** Submit fingerprints to stash-box instance */
  submitStashBoxFingerprints: { args: { input: StashBoxFingerprintSubmissionInput }; result: boolean };
  /** Submit scene as draft to stash-box instance */
  submitStashBoxSceneDraft: { args: { input: StashBoxDraftSubmissionInput }; result: string | null };
  /** Submit performer as draft to stash-box instance */
  submitStashBoxPerformerDraft: { args: { input: StashBoxDraftSubmissionInput }; result: string | null };
  /** Backup the database. Optionally returns a link to download the database file */
  backupDatabase: { args: { input: BackupDatabaseInput }; result: string | null };
  /** DANGEROUS: Execute an arbitrary SQL statement that returns rows. */
  querySQL: { args: { sql: string; args?: (JsonValue | null)[] | null }; result: SQLQueryResult };
  /** DANGEROUS: Execute an arbitrary SQL statement without returning any rows. */
  execSQL: { args: { sql: string; args?: (JsonValue | null)[] | null }; result: SQLExecResult };
  /** Run batch performer tag task. Returns the job ID. */
  stashBoxBatchPerformerTag: { args: { input: StashBoxBatchTagInput }; result: string };
  /** Run batch studio tag task. Returns the job ID. */
  stashBoxBatchStudioTag: { args: { input: StashBoxBatchTagInput }; result: string };
  /** Run batch tag tag task. Returns the job ID. */
  stashBoxBatchTagTag: { args: { input: StashBoxBatchTagInput }; result: string };
  /** Enables DLNA for an optional duration. Has no effect if DLNA is enabled by default */
  enableDLNA: { args: { input: EnableDLNAInput }; result: boolean };
  /** Disables DLNA for an optional duration. Has no effect if DLNA is disabled by default */
  disableDLNA: { args: { input: DisableDLNAInput }; result: boolean };
  /** Enables an IP address for DLNA for an optional duration */
  addTempDLNAIP: { args: { input: AddTempDLNAIPInput }; result: boolean };
  /** Removes an IP address from the temporary DLNA whitelist */
  removeTempDLNAIP: { args: { input: RemoveTempDLNAIPInput }; result: boolean };
};

export type Subscriptions = {
  /** Update from the metadata manager */
  jobsSubscribe: { args: Record<string, never>; result: JobStatusUpdate };
  loggingSubscribe: { args: Record<string, never>; result: LogEntry[] };
  scanCompleteSubscribe: { args: Record<string, never>; result: boolean };
};
