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
  file_id: string;
  scene_id: string;
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
  basename: string;
  created_at: string;
  fingerprint: string | null;
  fingerprints: Fingerprint[];
  id: string;
  mod_time: string;
  parent_folder: Folder;
  /** @deprecated Use parent_folder instead */
  parent_folder_id: string;
  path: string;
  size: number;
  updated_at: string;
  zip_file: BasicFile | null;
  /** @deprecated Use zip_file instead */
  zip_file_id: string | null;
};

export type BasicFile = {
  basename: string;
  created_at: string;
  fingerprint: string | null;
  fingerprints: Fingerprint[];
  id: string;
  mod_time: string;
  parent_folder: Folder;
  /** @deprecated Use parent_folder instead */
  parent_folder_id: string;
  path: string;
  size: number;
  updated_at: string;
  zip_file: BasicFile | null;
  /** @deprecated Use zip_file instead */
  zip_file_id: string | null;
};

export type BlobsStorageType =
  /** Database */
  | 'DATABASE'
  /** Filesystem */
  | 'FILESYSTEM';

export type BulkGalleryUpdateInput = {
  clientMutationId?: string | null;
  code?: string | null;
  custom_fields?: CustomFieldsInput | null;
  date?: string | null;
  details?: string | null;
  ids?: string[] | null;
  organized?: boolean | null;
  performer_ids?: BulkUpdateIds | null;
  photographer?: string | null;
  rating100?: number | null;
  scene_ids?: BulkUpdateIds | null;
  studio_id?: string | null;
  tag_ids?: BulkUpdateIds | null;
  /** @deprecated Use urls */
  url?: string | null;
  urls?: BulkUpdateStrings | null;
};

export type BulkGroupUpdateInput = {
  clientMutationId?: string | null;
  containing_groups?: BulkUpdateGroupDescriptionsInput | null;
  custom_fields?: CustomFieldsInput | null;
  date?: string | null;
  director?: string | null;
  ids?: string[] | null;
  rating100?: number | null;
  studio_id?: string | null;
  sub_groups?: BulkUpdateGroupDescriptionsInput | null;
  synopsis?: string | null;
  tag_ids?: BulkUpdateIds | null;
  urls?: BulkUpdateStrings | null;
};

export type BulkImageUpdateInput = {
  clientMutationId?: string | null;
  code?: string | null;
  custom_fields?: CustomFieldsInput | null;
  date?: string | null;
  details?: string | null;
  gallery_ids?: BulkUpdateIds | null;
  ids?: string[] | null;
  organized?: boolean | null;
  performer_ids?: BulkUpdateIds | null;
  photographer?: string | null;
  rating100?: number | null;
  studio_id?: string | null;
  tag_ids?: BulkUpdateIds | null;
  title?: string | null;
  /** @deprecated Use urls */
  url?: string | null;
  urls?: BulkUpdateStrings | null;
};

export type BulkMovieUpdateInput = {
  clientMutationId?: string | null;
  director?: string | null;
  ids?: string[] | null;
  rating100?: number | null;
  studio_id?: string | null;
  tag_ids?: BulkUpdateIds | null;
  urls?: BulkUpdateStrings | null;
};

export type BulkPerformerUpdateInput = {
  /** Duplicate aliases and those equal to name will result in an error (case-insensitive) */
  alias_list?: BulkUpdateStrings | null;
  birthdate?: string | null;
  career_end?: string | null;
  /** @deprecated Use career_start and career_end */
  career_length?: string | null;
  career_start?: string | null;
  circumcised?: CircumcisedEnum | null;
  clientMutationId?: string | null;
  country?: string | null;
  custom_fields?: CustomFieldsInput | null;
  death_date?: string | null;
  details?: string | null;
  disambiguation?: string | null;
  ethnicity?: string | null;
  eye_color?: string | null;
  fake_tits?: string | null;
  favorite?: boolean | null;
  gender?: GenderEnum | null;
  hair_color?: string | null;
  height_cm?: number | null;
  ids?: string[] | null;
  ignore_auto_tag?: boolean | null;
  /** @deprecated Use urls */
  instagram?: string | null;
  measurements?: string | null;
  penis_length?: number | null;
  piercings?: string | null;
  rating100?: number | null;
  tag_ids?: BulkUpdateIds | null;
  tattoos?: string | null;
  /** @deprecated Use urls */
  twitter?: string | null;
  /** @deprecated Use urls */
  url?: string | null;
  urls?: BulkUpdateStrings | null;
  weight?: number | null;
};

export type BulkSceneMarkerUpdateInput = {
  ids?: string[] | null;
  primary_tag_id?: string | null;
  tag_ids?: BulkUpdateIds | null;
  title?: string | null;
};

export type BulkSceneUpdateInput = {
  clientMutationId?: string | null;
  code?: string | null;
  custom_fields?: CustomFieldsInput | null;
  date?: string | null;
  details?: string | null;
  director?: string | null;
  gallery_ids?: BulkUpdateIds | null;
  group_ids?: BulkUpdateIds | null;
  ids?: string[] | null;
  /** @deprecated Use group_ids */
  movie_ids?: BulkUpdateIds | null;
  organized?: boolean | null;
  performer_ids?: BulkUpdateIds | null;
  rating100?: number | null;
  studio_id?: string | null;
  tag_ids?: BulkUpdateIds | null;
  title?: string | null;
  /** @deprecated Use urls */
  url?: string | null;
  urls?: BulkUpdateStrings | null;
};

export type BulkStudioUpdateInput = {
  details?: string | null;
  favorite?: boolean | null;
  ids: string[];
  ignore_auto_tag?: boolean | null;
  organized?: boolean | null;
  parent_id?: string | null;
  rating100?: number | null;
  tag_ids?: BulkUpdateIds | null;
  /** @deprecated Use urls */
  url?: string | null;
  urls?: BulkUpdateStrings | null;
};

export type BulkTagUpdateInput = {
  /** Duplicate aliases and those equal to name will result in an error (case-insensitive) */
  aliases?: BulkUpdateStrings | null;
  child_ids?: BulkUpdateIds | null;
  description?: string | null;
  favorite?: boolean | null;
  ids?: string[] | null;
  ignore_auto_tag?: boolean | null;
  parent_ids?: BulkUpdateIds | null;
};

export type BulkUpdateGroupDescriptionsInput = {
  groups: GroupDescriptionInput[];
  mode: BulkUpdateIdMode;
};

export type BulkUpdateIdMode =
  | 'ADD'
  | 'REMOVE'
  | 'SET';

export type BulkUpdateIds = {
  ids?: string[] | null;
  mode: BulkUpdateIdMode;
};

export type BulkUpdateStrings = {
  mode: BulkUpdateIdMode;
  values?: string[] | null;
};

export type CircumcisedEnum =
  | 'CUT'
  | 'UNCUT';

export type CircumcisionCriterionInput = {
  modifier: CriterionModifier;
  value?: CircumcisedEnum[] | null;
};

export type CleanGeneratedInput = {
  /** Clean blob files without blob entries */
  blobFiles?: boolean | null;
  /** Do a dry run. Don't delete any files */
  dryRun?: boolean | null;
  /** Clean image thumbnails/clips without image entries */
  imageThumbnails?: boolean | null;
  /** Clean marker files without marker entries */
  markers?: boolean | null;
  /** Clean preview files without scene entries */
  screenshots?: boolean | null;
  /** Clean sprite and vtt files without scene entries */
  sprites?: boolean | null;
  /** Clean scene transcodes without scene entries */
  transcodes?: boolean | null;
};

export type CleanMetadataInput = {
  /** Do a dry run. Don't delete any files */
  dryRun: boolean;
  /**
   * Don't check zip file contents when determining whether to clean a file.
   * This can significantly speed up the clean process, but will potentially miss removed files within zip files.
   * Where users do not modify zip files contents directly, this should be safe to use.
   * Defaults to false.
   */
  ignoreZipFileContents?: boolean | null;
  paths?: string[] | null;
};

export type ConfigDLNAInput = {
  /** True if DLNA service should be enabled by default */
  enabled?: boolean | null;
  /** List of interfaces to run DLNA on. Empty for all */
  interfaces?: string[] | null;
  /** Defaults to 1338 */
  port?: number | null;
  serverName?: string | null;
  /** Order to sort videos */
  videoSortOrder?: string | null;
  /** List of IPs whitelisted for DLNA service */
  whitelistedIPs?: string[] | null;
};

export type ConfigDLNAResult = {
  /** True if DLNA service should be enabled by default */
  enabled: boolean;
  /** List of interfaces to run DLNA on. Empty for all */
  interfaces: string[];
  /** Defaults to 1338 */
  port: number;
  serverName: string;
  /** Order to sort videos */
  videoSortOrder: string;
  /** List of IPs whitelisted for DLNA service */
  whitelistedIPs: string[];
};

export type ConfigDefaultSettingsInput = {
  autoTag?: AutoTagMetadataInput | null;
  /** If true, delete file checkbox will be checked by default */
  deleteFile?: boolean | null;
  /** If true, delete generated files checkbox will be checked by default */
  deleteGenerated?: boolean | null;
  generate?: GenerateMetadataInput | null;
  identify?: IdentifyMetadataInput | null;
  scan?: ScanMetadataInput | null;
};

export type ConfigDefaultSettingsResult = {
  autoTag: AutoTagMetadataOptions | null;
  /** If true, delete file checkbox will be checked by default */
  deleteFile: boolean | null;
  /** If true, delete generated supporting files checkbox will be checked by default */
  deleteGenerated: boolean | null;
  generate: GenerateMetadataOptions | null;
  identify: IdentifyMetadataTaskOptions | null;
  scan: ScanMetadataOptions | null;
};

export type ConfigDisableDropdownCreate = {
  gallery: boolean;
  movie: boolean;
  performer: boolean;
  studio: boolean;
  tag: boolean;
};

export type ConfigDisableDropdownCreateInput = {
  gallery?: boolean | null;
  movie?: boolean | null;
  performer?: boolean | null;
  studio?: boolean | null;
  tag?: boolean | null;
};

export type ConfigGeneralInput = {
  /** Path to backup directory */
  backupDirectoryPath?: string | null;
  /** Path to blobs - required for filesystem blob storage */
  blobsPath?: string | null;
  /** Where to store blobs */
  blobsStorage?: BlobsStorageType | null;
  /** Path to cache */
  cachePath?: string | null;
  /** Whether to calculate MD5 checksums for scene video files */
  calculateMD5?: boolean | null;
  /** True if galleries should be created from folders with images */
  createGalleriesFromFolders?: boolean | null;
  /** Create Image Clips from Video extensions when Videos are disabled in Library */
  createImageClipsFromVideos?: boolean | null;
  /** Custom Performer Image Location */
  customPerformerImageLocation?: string | null;
  /** Path to the SQLite database */
  databasePath?: string | null;
  /** Path to trash directory - if set, deleted files will be moved here instead of being permanently deleted */
  deleteTrashPath?: string | null;
  /** whether to include range in generated funscript heatmaps */
  drawFunscriptHeatmapRange?: boolean | null;
  /** Array of file regexp to exclude from Video Scans */
  excludes?: string[] | null;
  /** Path to the ffmpeg binary. If empty, stash will attempt to find it in the path or config directory */
  ffmpegPath?: string | null;
  /** Path to the ffprobe binary. If empty, stash will attempt to find it in the path or config directory */
  ffprobePath?: string | null;
  /** Regex used to identify images as gallery covers */
  galleryCoverRegex?: string | null;
  /** Array of gallery zip file extensions */
  galleryExtensions?: string[] | null;
  /** Path to generated files */
  generatedPath?: string | null;
  /** Array of file regexp to exclude from Image Scans */
  imageExcludes?: string[] | null;
  /** Array of image file extensions */
  imageExtensions?: string[] | null;
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
  /** Whether to log http access */
  logAccess?: boolean | null;
  /** Name of the log file */
  logFile?: string | null;
  /** Maximum log size */
  logFileMaxSize?: number | null;
  /** Minimum log level */
  logLevel?: string | null;
  /** Whether to also output to stderr */
  logOut?: boolean | null;
  /** Maximum session cookie age */
  maxSessionAge?: number | null;
  /** Max streaming transcode size */
  maxStreamingTranscodeSize?: StreamingResolutionEnum | null;
  /** Max generated transcode size */
  maxTranscodeSize?: StreamingResolutionEnum | null;
  /** Minimum number of sprites to be generated - only used if useCustomSpriteInterval is true */
  maximumSprites?: number | null;
  /** Path to import/export files */
  metadataPath?: string | null;
  /** Minimum number of sprites to be generated - only used if useCustomSpriteInterval is true */
  minimumSprites?: number | null;
  /** Number of parallel tasks to start during scan/generate */
  parallelTasks?: number | null;
  /** Password */
  password?: string | null;
  /** Source of plugin packages */
  pluginPackageSources?: PackageSourceInput[] | null;
  /** Path to plugins */
  pluginsPath?: string | null;
  /** Include audio stream in previews */
  previewAudio?: boolean | null;
  /** Duration of end of video to exclude when generating previews */
  previewExcludeEnd?: string | null;
  /** Duration of start of video to exclude when generating previews */
  previewExcludeStart?: string | null;
  /** Preset when generating preview */
  previewPreset?: PreviewPreset | null;
  /** Preview segment duration, in seconds */
  previewSegmentDuration?: number | null;
  /** Number of segments in a preview file */
  previewSegments?: number | null;
  /** Python path - resolved using path if unset */
  pythonPath?: string | null;
  /** Source of scraper packages */
  scraperPackageSources?: PackageSourceInput[] | null;
  /** Path to scrapers */
  scrapersPath?: string | null;
  /** Time between two different scrubber sprites in seconds - only used if useCustomSpriteInterval is true */
  spriteInterval?: number | null;
  /** Size of the longest dimension for each sprite in pixels */
  spriteScreenshotSize?: number | null;
  /** Stash-box instances used for tagging */
  stashBoxes?: StashBoxInput[] | null;
  /** Array of file paths to content */
  stashes?: StashConfigInput[] | null;
  /** Transcode Hardware Acceleration */
  transcodeHardwareAcceleration?: boolean | null;
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
  /** True if sprite generation should use the sprite interval and min/max sprites settings instead of the default */
  useCustomSpriteInterval?: boolean | null;
  /** Username */
  username?: string | null;
  /** Array of video file extensions */
  videoExtensions?: string[] | null;
  /** Hash algorithm to use for generated file naming */
  videoFileNamingAlgorithm?: HashAlgorithm | null;
  /** Write image thumbnails to disk when generating on the fly */
  writeImageThumbnails?: boolean | null;
};

export type ConfigGeneralResult = {
  /** API Key */
  apiKey: string;
  /** Path to backup directory */
  backupDirectoryPath: string;
  /** Path to blobs - required for filesystem blob storage */
  blobsPath: string;
  /** Where to store blobs */
  blobsStorage: BlobsStorageType;
  /** Path to cache */
  cachePath: string;
  /** Whether to calculate MD5 checksums for scene video files */
  calculateMD5: boolean;
  /** Path to the config file used */
  configFilePath: string;
  /** True if galleries should be created from folders with images */
  createGalleriesFromFolders: boolean;
  /** Create Image Clips from Video extensions when Videos are disabled in Library */
  createImageClipsFromVideos: boolean;
  /** Custom Performer Image Location */
  customPerformerImageLocation: string | null;
  /** Path to the SQLite database */
  databasePath: string;
  /** Path to trash directory - if set, deleted files will be moved here instead of being permanently deleted */
  deleteTrashPath: string;
  /** whether to include range in generated funscript heatmaps */
  drawFunscriptHeatmapRange: boolean;
  /** Array of file regexp to exclude from Video Scans */
  excludes: string[];
  /** Path to the ffmpeg binary. If empty, stash will attempt to find it in the path or config directory */
  ffmpegPath: string;
  /** Path to the ffprobe binary. If empty, stash will attempt to find it in the path or config directory */
  ffprobePath: string;
  /** Regex used to identify images as gallery covers */
  galleryCoverRegex: string;
  /** Array of gallery zip file extensions */
  galleryExtensions: string[];
  /** Path to generated files */
  generatedPath: string;
  /** Array of file regexp to exclude from Image Scans */
  imageExcludes: string[];
  /** Array of image file extensions */
  imageExtensions: string[];
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
  /** Whether to log http access */
  logAccess: boolean;
  /** Name of the log file */
  logFile: string | null;
  /** Maximum log size */
  logFileMaxSize: number;
  /** Minimum log level */
  logLevel: string;
  /** Whether to also output to stderr */
  logOut: boolean;
  /** Maximum session cookie age */
  maxSessionAge: number;
  /** Max streaming transcode size */
  maxStreamingTranscodeSize: StreamingResolutionEnum | null;
  /** Max generated transcode size */
  maxTranscodeSize: StreamingResolutionEnum | null;
  /** Maximum number of sprites to be generated - only used if useCustomSpriteInterval is true */
  maximumSprites: number;
  /** Path to import/export files */
  metadataPath: string;
  /** Minimum number of sprites to be generated - only used if useCustomSpriteInterval is true */
  minimumSprites: number;
  /** Number of parallel tasks to start during scan/generate */
  parallelTasks: number;
  /** Password */
  password: string;
  /** Source of plugin packages */
  pluginPackageSources: PackageSource[];
  /** Path to plugins */
  pluginsPath: string;
  /** Include audio stream in previews */
  previewAudio: boolean;
  /** Duration of end of video to exclude when generating previews */
  previewExcludeEnd: string;
  /** Duration of start of video to exclude when generating previews */
  previewExcludeStart: string;
  /** Preset when generating preview */
  previewPreset: PreviewPreset;
  /** Preview segment duration, in seconds */
  previewSegmentDuration: number;
  /** Number of segments in a preview file */
  previewSegments: number;
  /** Python path - resolved using path if unset */
  pythonPath: string;
  /** Source of scraper packages */
  scraperPackageSources: PackageSource[];
  /** Path to scrapers */
  scrapersPath: string;
  /** Time between two different scrubber sprites in seconds - only used if useCustomSpriteInterval is true */
  spriteInterval: number;
  /** Size of the longest dimension for each sprite in pixels */
  spriteScreenshotSize: number;
  /** Stash-box instances used for tagging */
  stashBoxes: StashBox[];
  /** Array of file paths to content */
  stashes: StashConfig[];
  /** Transcode Hardware Acceleration */
  transcodeHardwareAcceleration: boolean;
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
  /** True if sprite generation should use the sprite interval and min/max sprites settings instead of the default */
  useCustomSpriteInterval: boolean;
  /** Username */
  username: string;
  /** Array of video file extensions */
  videoExtensions: string[];
  /** Hash algorithm to use for generated file naming */
  videoFileNamingAlgorithm: HashAlgorithm;
  /** Write image thumbnails to disk when generating on the fly */
  writeImageThumbnails: boolean;
};

export type ConfigImageLightboxInput = {
  disableAnimation?: boolean | null;
  displayMode?: ImageLightboxDisplayMode | null;
  resetZoomOnNav?: boolean | null;
  scaleUp?: boolean | null;
  scrollAttemptsBeforeChange?: number | null;
  scrollMode?: ImageLightboxScrollMode | null;
  slideshowDelay?: number | null;
};

export type ConfigImageLightboxResult = {
  disableAnimation: boolean | null;
  displayMode: ImageLightboxDisplayMode | null;
  resetZoomOnNav: boolean | null;
  scaleUp: boolean | null;
  scrollAttemptsBeforeChange: number;
  scrollMode: ImageLightboxScrollMode | null;
  slideshowDelay: number | null;
};

export type ConfigInterfaceInput = {
  /** If true, video will autostart on load in the scene player */
  autostartVideo?: boolean | null;
  /** If true, video will autostart when loading from play random or play selected */
  autostartVideoOnPlaySelected?: boolean | null;
  /** If true, next scene in playlist will be played at video end by default */
  continuePlaylistDefault?: boolean | null;
  /** Custom CSS */
  css?: string | null;
  cssEnabled?: boolean | null;
  /** Custom Locales */
  customLocales?: string | null;
  customLocalesEnabled?: boolean | null;
  /** When true, disables all customizations (plugins, CSS, JavaScript, locales) for troubleshooting */
  disableCustomizations?: boolean | null;
  /** Set to true to disable creating new objects via the dropdown menus */
  disableDropdownCreate?: ConfigDisableDropdownCreateInput | null;
  /** Funscript Time Offset */
  funscriptOffset?: number | null;
  /** Handy Connection Key */
  handyKey?: string | null;
  imageLightbox?: ConfigImageLightboxInput | null;
  /** Custom Javascript */
  javascript?: string | null;
  javascriptEnabled?: boolean | null;
  /** Interface language */
  language?: string | null;
  /** Maximum duration (in seconds) in which a scene video will loop in the scene player */
  maximumLoopDuration?: number | null;
  /** Ordered list of items that should be shown in the menu */
  menuItems?: string[] | null;
  /** True if we should not auto-open a browser window on startup */
  noBrowser?: boolean | null;
  /** True if we should send notifications to the desktop */
  notificationsEnabled?: boolean | null;
  /** True if SFW content mode is enabled */
  sfwContentMode?: boolean | null;
  /** Show scene scrubber by default */
  showScrubber?: boolean | null;
  /** If true, studio overlays will be shown as text instead of logo images */
  showStudioAsText?: boolean | null;
  /** Enable sound on mouseover previews */
  soundOnPreview?: boolean | null;
  /** Whether to use Stash Hosted Funscript */
  useStashHostedFunscript?: boolean | null;
  /** Wall playback type */
  wallPlayback?: string | null;
  /** Show title and tags in wall view */
  wallShowTitle?: boolean | null;
};

export type ConfigInterfaceResult = {
  /** If true, video will autostart on load in the scene player */
  autostartVideo: boolean | null;
  /** If true, video will autostart when loading from play random or play selected */
  autostartVideoOnPlaySelected: boolean | null;
  /** If true, next scene in playlist will be played at video end by default */
  continuePlaylistDefault: boolean | null;
  /** Custom CSS */
  css: string | null;
  cssEnabled: boolean | null;
  /** Custom Locales */
  customLocales: string | null;
  customLocalesEnabled: boolean | null;
  /** When true, disables all customizations (plugins, CSS, JavaScript, locales) for troubleshooting */
  disableCustomizations: boolean | null;
  /** Fields are true if creating via dropdown menus are disabled */
  disableDropdownCreate: ConfigDisableDropdownCreate;
  /** Funscript Time Offset */
  funscriptOffset: number | null;
  /** Handy Connection Key */
  handyKey: string | null;
  imageLightbox: ConfigImageLightboxResult;
  /** Custom Javascript */
  javascript: string | null;
  javascriptEnabled: boolean | null;
  /** Interface language */
  language: string | null;
  /** Maximum duration (in seconds) in which a scene video will loop in the scene player */
  maximumLoopDuration: number | null;
  /** Ordered list of items that should be shown in the menu */
  menuItems: string[] | null;
  /** True if we should not auto-open a browser window on startup */
  noBrowser: boolean | null;
  /** True if we should send desktop notifications */
  notificationsEnabled: boolean | null;
  /** True if SFW content mode is enabled */
  sfwContentMode: boolean;
  /** Show scene scrubber by default */
  showScrubber: boolean | null;
  /** If true, studio overlays will be shown as text instead of logo images */
  showStudioAsText: boolean | null;
  /** Enable sound on mouseover previews */
  soundOnPreview: boolean | null;
  /** Whether to use Stash Hosted Funscript */
  useStashHostedFunscript: boolean | null;
  /** Wall playback type */
  wallPlayback: string | null;
  /** Show title and tags in wall view */
  wallShowTitle: boolean | null;
};

/** All configuration settings */
export type ConfigResult = {
  defaults: ConfigDefaultSettingsResult;
  dlna: ConfigDLNAResult;
  general: ConfigGeneralResult;
  interface: ConfigInterfaceResult;
  plugins: Record<string, JsonValue>;
  scraping: ConfigScrapingResult;
  ui: Record<string, JsonValue>;
};

export type ConfigScrapingInput = {
  /** Tags blacklist during scraping */
  excludeTagPatterns?: string[] | null;
  /** Scraper CDP path. Path to chrome executable or remote address */
  scraperCDPPath?: string | null;
  /** Whether the scraper should check for invalid certificates */
  scraperCertCheck?: boolean | null;
  /** Scraper user agent string */
  scraperUserAgent?: string | null;
};

export type ConfigScrapingResult = {
  /** Tags blacklist during scraping */
  excludeTagPatterns: string[];
  /** Scraper CDP path. Path to chrome executable or remote address */
  scraperCDPPath: string | null;
  /** Whether the scraper should check for invalid certificates */
  scraperCertCheck: boolean;
  /** Scraper user agent string */
  scraperUserAgent: string | null;
};

export type CriterionModifier =
  /** >= AND <= */
  | 'BETWEEN'
  /** = */
  | 'EQUALS'
  | 'EXCLUDES'
  /** > */
  | 'GREATER_THAN'
  | 'INCLUDES'
  /** INCLUDES ALL */
  | 'INCLUDES_ALL'
  /** IS NULL */
  | 'IS_NULL'
  /** < */
  | 'LESS_THAN'
  /** MATCHES REGEX */
  | 'MATCHES_REGEX'
  /** < OR > */
  | 'NOT_BETWEEN'
  /** != */
  | 'NOT_EQUALS'
  /** NOT MATCHES REGEX */
  | 'NOT_MATCHES_REGEX'
  /** IS NOT NULL */
  | 'NOT_NULL';

export type CustomFieldCriterionInput = {
  field: string;
  modifier: CriterionModifier;
  value?: JsonValue[] | null;
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
  allowedIPAddresses: DLNAIP[];
  recentIPAddresses: string[];
  running: boolean;
  /** If not currently running, time until it will be started. If running, time until it will be stopped */
  until: string | null;
};

export type DateCriterionInput = {
  modifier: CriterionModifier;
  value: string;
  value2?: string | null;
};

export type DestroyFilterInput = {
  id: string;
};

/** Directory structure of a path */
export type Directory = {
  directories: string[];
  parent: string | null;
  path: string;
};

export type DisableDLNAInput = {
  /** Duration to enable, in minutes. 0 or null for indefinite. */
  duration?: number | null;
};

export type DuplicationCriterionInput = {
  /** Currently unimplemented. Intended for phash distance matching. */
  distance?: number | null;
  /** @deprecated Use phash field instead */
  duplicated?: boolean | null;
  /** Filter by phash duplication */
  phash?: boolean | null;
  /** Filter by Stash ID duplication */
  stash_id?: boolean | null;
  /** Filter by title duplication */
  title?: boolean | null;
  /** Filter by URL duplication */
  url?: boolean | null;
};

export type EnableDLNAInput = {
  /** Duration to enable, in minutes. 0 or null for indefinite. */
  duration?: number | null;
};

export type ExportObjectTypeInput = {
  all?: boolean | null;
  ids?: string[] | null;
};

export type ExportObjectsInput = {
  galleries?: ExportObjectTypeInput | null;
  groups?: ExportObjectTypeInput | null;
  images?: ExportObjectTypeInput | null;
  includeDependencies?: boolean | null;
  /** @deprecated Use groups instead */
  movies?: ExportObjectTypeInput | null;
  performers?: ExportObjectTypeInput | null;
  scenes?: ExportObjectTypeInput | null;
  studios?: ExportObjectTypeInput | null;
  tags?: ExportObjectTypeInput | null;
};

export type FileDuplicationCriterionInput = {
  /** Currently unimplemented. Intended for phash distance matching. */
  distance?: number | null;
  /** @deprecated Use phash field instead */
  duplicated?: boolean | null;
  /** Filter by phash duplication */
  phash?: boolean | null;
};

export type FileFilterType = {
  AND?: FileFilterType | null;
  NOT?: FileFilterType | null;
  OR?: FileFilterType | null;
  basename?: StringCriterionInput | null;
  /** Filter by creation time */
  created_at?: TimestampCriterionInput | null;
  dir?: StringCriterionInput | null;
  /** Filter files by duplication criteria (only phash applies to files) */
  duplicated?: FileDuplicationCriterionInput | null;
  /** Filter by related galleries that meet this criteria */
  galleries_filter?: GalleryFilterType | null;
  gallery_count?: IntCriterionInput | null;
  /** find files based on hash */
  hashes?: FingerprintFilterInput[] | null;
  image_count?: IntCriterionInput | null;
  image_file_filter?: ImageFileFilterInput | null;
  /** Filter by related images that meet this criteria */
  images_filter?: ImageFilterType | null;
  /** Filter by modification time */
  mod_time?: TimestampCriterionInput | null;
  parent_folder?: HierarchicalMultiCriterionInput | null;
  path?: StringCriterionInput | null;
  scene_count?: IntCriterionInput | null;
  /** Filter by related scenes that meet this criteria */
  scenes_filter?: SceneFilterType | null;
  /** Filter by last update time */
  updated_at?: TimestampCriterionInput | null;
  video_file_filter?: VideoFileFilterInput | null;
  zip_file?: MultiCriterionInput | null;
};

export type FileSetFingerprintsInput = {
  /** only supplied fingerprint types will be modified */
  fingerprints: SetFingerprintsInput[];
  id: string;
};

export type FilterMode =
  | 'GALLERIES'
  | 'GROUPS'
  | 'IMAGES'
  | 'MOVIES'
  | 'PERFORMERS'
  | 'SCENES'
  | 'SCENE_MARKERS'
  | 'STUDIOS'
  | 'TAGS';

export type FindFilesResultType = {
  count: number;
  /** Total duration in seconds of any video files */
  duration: number;
  files: BaseFile[];
  /** Total megapixels of any image files */
  megapixels: number;
  /** Total file size in bytes */
  size: number;
};

export type FindFilterType = {
  direction?: SortDirectionEnum | null;
  page?: number | null;
  /** use per_page = -1 to indicate all results. Defaults to 25. */
  per_page?: number | null;
  q?: string | null;
  sort?: string | null;
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
  chapters: GalleryChapter[];
  count: number;
};

export type FindGroupsResultType = {
  count: number;
  groups: Group[];
};

export type FindImagesResultType = {
  count: number;
  /** Total file size in bytes */
  filesize: number;
  images: Image[];
  /** Total megapixels of the images */
  megapixels: number;
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
  /** Hamming distance - defaults to 0 */
  distance?: number | null;
  type: string;
  value: string;
};

export type FloatCriterionInput = {
  modifier: CriterionModifier;
  value: number;
  value2?: number | null;
};

export type Folder = {
  basename: string;
  created_at: string;
  id: string;
  mod_time: string;
  parent_folder: Folder | null;
  /** @deprecated Use parent_folder instead */
  parent_folder_id: string | null;
  /** Returns all parent folders in order from immediate parent to top-level */
  parent_folders: Folder[];
  path: string;
  /** Returns direct sub-folders */
  sub_folders: Folder[];
  updated_at: string;
  zip_file: BasicFile | null;
  /** @deprecated Use zip_file instead */
  zip_file_id: string | null;
};

export type FolderFilterType = {
  AND?: FolderFilterType | null;
  NOT?: FolderFilterType | null;
  OR?: FolderFilterType | null;
  basename?: StringCriterionInput | null;
  /** Filter by creation time */
  created_at?: TimestampCriterionInput | null;
  /** Filter by files that meet this criteria */
  files_filter?: FileFilterType | null;
  /** Filter by related galleries that meet this criteria */
  galleries_filter?: GalleryFilterType | null;
  gallery_count?: IntCriterionInput | null;
  /** Filter by modification time */
  mod_time?: TimestampCriterionInput | null;
  parent_folder?: HierarchicalMultiCriterionInput | null;
  path?: StringCriterionInput | null;
  /** Filter by last update time */
  updated_at?: TimestampCriterionInput | null;
  zip_file?: MultiCriterionInput | null;
};

/** Gallery type */
export type Gallery = {
  chapters: GalleryChapter[];
  code: string | null;
  cover: Image | null;
  created_at: string;
  custom_fields: Record<string, JsonValue>;
  date: string | null;
  details: string | null;
  files: GalleryFile[];
  folder: Folder | null;
  id: string;
  image: Image;
  image_count: number;
  organized: boolean;
  paths: GalleryPathsType;
  performers: Performer[];
  photographer: string | null;
  rating100: number | null;
  scenes: Scene[];
  studio: Studio | null;
  tags: Tag[];
  title: string | null;
  updated_at: string;
  /** @deprecated Use urls */
  url: string | null;
  urls: string[];
};

export type GalleryAddInput = {
  gallery_id: string;
  image_ids: string[];
};

export type GalleryChapter = {
  created_at: string;
  gallery: Gallery;
  id: string;
  image_index: number;
  title: string;
  updated_at: string;
};

export type GalleryChapterCreateInput = {
  gallery_id: string;
  image_index: number;
  title: string;
};

export type GalleryChapterUpdateInput = {
  gallery_id?: string | null;
  id: string;
  image_index?: number | null;
  title?: string | null;
};

export type GalleryCreateInput = {
  code?: string | null;
  custom_fields?: Record<string, JsonValue> | null;
  date?: string | null;
  details?: string | null;
  organized?: boolean | null;
  performer_ids?: string[] | null;
  photographer?: string | null;
  rating100?: number | null;
  scene_ids?: string[] | null;
  studio_id?: string | null;
  tag_ids?: string[] | null;
  title: string;
  /** @deprecated Use urls */
  url?: string | null;
  urls?: string[] | null;
};

export type GalleryDestroyInput = {
  /**
   * If true, then the zip file will be deleted if the gallery is zip-file-based.
   * If gallery is folder-based, then any files not associated with other
   * galleries will be deleted, along with the folder, if it is not empty.
   */
  delete_file?: boolean | null;
  delete_generated?: boolean | null;
  /** If true, delete the file entry from the database if the file is not assigned to any other objects */
  destroy_file_entry?: boolean | null;
  ids: string[];
};

export type GalleryFile = {
  basename: string;
  created_at: string;
  fingerprint: string | null;
  fingerprints: Fingerprint[];
  id: string;
  mod_time: string;
  parent_folder: Folder;
  /** @deprecated Use parent_folder instead */
  parent_folder_id: string;
  path: string;
  size: number;
  updated_at: string;
  zip_file: BasicFile | null;
  /** @deprecated Use zip_file instead */
  zip_file_id: string | null;
};

export type GalleryFilterType = {
  AND?: GalleryFilterType | null;
  NOT?: GalleryFilterType | null;
  OR?: GalleryFilterType | null;
  /** Filter by average image resolution */
  average_resolution?: ResolutionCriterionInput | null;
  /** Filter by file checksum */
  checksum?: StringCriterionInput | null;
  /** Filter by studio code */
  code?: StringCriterionInput | null;
  /** Filter by creation time */
  created_at?: TimestampCriterionInput | null;
  custom_fields?: CustomFieldCriterionInput[] | null;
  /** Filter by date */
  date?: DateCriterionInput | null;
  details?: StringCriterionInput | null;
  /** Filter by zip-file count */
  file_count?: IntCriterionInput | null;
  /** Filter by related files that meet this criteria */
  files_filter?: FileFilterType | null;
  /** Filter by related folders that meet this criteria */
  folders_filter?: FolderFilterType | null;
  /** Filter to only include galleries that have chapters. `true` or `false` */
  has_chapters?: string | null;
  id?: IntCriterionInput | null;
  /** Filter by number of images in this gallery */
  image_count?: IntCriterionInput | null;
  /** Filter by related images that meet this criteria */
  images_filter?: ImageFilterType | null;
  /** Filter to only include galleries missing this property */
  is_missing?: string | null;
  /** Filter to include/exclude galleries that were created from zip */
  is_zip?: boolean | null;
  /** Filter by organized */
  organized?: boolean | null;
  /** Filter by parent folder of the zip or folder the gallery is in */
  parent_folder?: HierarchicalMultiCriterionInput | null;
  /** Filter by path */
  path?: StringCriterionInput | null;
  /** Filter galleries by performer age at time of gallery */
  performer_age?: IntCriterionInput | null;
  /** Filter by performer count */
  performer_count?: IntCriterionInput | null;
  /** Filter galleries that have performers that have been favorited */
  performer_favorite?: boolean | null;
  /** Filter to only include galleries with performers with these tags */
  performer_tags?: HierarchicalMultiCriterionInput | null;
  /** Filter to only include galleries with these performers */
  performers?: MultiCriterionInput | null;
  /** Filter by related performers that meet this criteria */
  performers_filter?: PerformerFilterType | null;
  /** Filter by photographer */
  photographer?: StringCriterionInput | null;
  rating100?: IntCriterionInput | null;
  /** Filter to only include galleries with these scenes */
  scenes?: MultiCriterionInput | null;
  /** Filter by related scenes that meet this criteria */
  scenes_filter?: SceneFilterType | null;
  /** Filter to only include galleries with this studio */
  studios?: HierarchicalMultiCriterionInput | null;
  /** Filter by related studios that meet this criteria */
  studios_filter?: StudioFilterType | null;
  /** Filter by tag count */
  tag_count?: IntCriterionInput | null;
  /** Filter to only include galleries with these tags */
  tags?: HierarchicalMultiCriterionInput | null;
  /** Filter by related tags that meet this criteria */
  tags_filter?: TagFilterType | null;
  title?: StringCriterionInput | null;
  /** Filter by last update time */
  updated_at?: TimestampCriterionInput | null;
  /** Filter by url */
  url?: StringCriterionInput | null;
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
  cover_image_id: string;
  gallery_id: string;
};

export type GalleryUpdateInput = {
  clientMutationId?: string | null;
  code?: string | null;
  custom_fields?: CustomFieldsInput | null;
  date?: string | null;
  details?: string | null;
  id: string;
  organized?: boolean | null;
  performer_ids?: string[] | null;
  photographer?: string | null;
  primary_file_id?: string | null;
  rating100?: number | null;
  scene_ids?: string[] | null;
  studio_id?: string | null;
  tag_ids?: string[] | null;
  title?: string | null;
  /** @deprecated Use urls */
  url?: string | null;
  urls?: string[] | null;
};

export type GenderCriterionInput = {
  modifier: CriterionModifier;
  value?: GenderEnum | null;
  value_list?: GenderEnum[] | null;
};

export type GenderEnum =
  | 'FEMALE'
  | 'INTERSEX'
  | 'MALE'
  | 'NON_BINARY'
  | 'TRANSGENDER_FEMALE'
  | 'TRANSGENDER_MALE';

export type GenerateAPIKeyInput = {
  clear?: boolean | null;
};

export type GenerateMetadataInput = {
  clipPreviews?: boolean | null;
  covers?: boolean | null;
  /** Generate transcodes even if not required */
  forceTranscodes?: boolean | null;
  /** gallery ids to generate for */
  galleryIDs?: string[] | null;
  /** image ids to generate for */
  imageIDs?: string[] | null;
  /** Generate image phashes during scan */
  imagePhashes?: boolean | null;
  imagePreviews?: boolean | null;
  imageThumbnails?: boolean | null;
  interactiveHeatmapsSpeeds?: boolean | null;
  /** marker ids to generate for */
  markerIDs?: string[] | null;
  markerImagePreviews?: boolean | null;
  markerScreenshots?: boolean | null;
  markers?: boolean | null;
  /** overwrite existing media */
  overwrite?: boolean | null;
  /** paths to run generate on, in addition to the other ID lists */
  paths?: string[] | null;
  /** Generate video phashes during scan */
  phashes?: boolean | null;
  previewOptions?: GeneratePreviewOptionsInput | null;
  previews?: boolean | null;
  /** scene ids to generate for */
  sceneIDs?: string[] | null;
  sprites?: boolean | null;
  transcodes?: boolean | null;
};

export type GenerateMetadataOptions = {
  clipPreviews: boolean | null;
  covers: boolean | null;
  imagePreviews: boolean | null;
  imageThumbnails: boolean | null;
  interactiveHeatmapsSpeeds: boolean | null;
  markerImagePreviews: boolean | null;
  markerScreenshots: boolean | null;
  markers: boolean | null;
  phashes: boolean | null;
  previewOptions: GeneratePreviewOptions | null;
  previews: boolean | null;
  sprites: boolean | null;
  transcodes: boolean | null;
};

export type GeneratePreviewOptions = {
  /** Duration of end of video to exclude when generating previews */
  previewExcludeEnd: string | null;
  /** Duration of start of video to exclude when generating previews */
  previewExcludeStart: string | null;
  /** Preset when generating preview */
  previewPreset: PreviewPreset | null;
  /** Preview segment duration, in seconds */
  previewSegmentDuration: number | null;
  /** Number of segments in a preview file */
  previewSegments: number | null;
};

export type GeneratePreviewOptionsInput = {
  /** Duration of end of video to exclude when generating previews */
  previewExcludeEnd?: string | null;
  /** Duration of start of video to exclude when generating previews */
  previewExcludeStart?: string | null;
  /** Preset when generating preview */
  previewPreset?: PreviewPreset | null;
  /** Preview segment duration, in seconds */
  previewSegmentDuration?: number | null;
  /** Number of segments in a preview file */
  previewSegments?: number | null;
};

export type Group = {
  aliases: string | null;
  back_image_path: string | null;
  containing_groups: GroupDescription[];
  created_at: string;
  custom_fields: Record<string, JsonValue>;
  date: string | null;
  director: string | null;
  /** Duration in seconds */
  duration: number | null;
  front_image_path: string | null;
  id: string;
  name: string;
  o_counter: number | null;
  performer_count: number;
  rating100: number | null;
  scene_count: number;
  scenes: Scene[];
  studio: Studio | null;
  sub_group_count: number;
  sub_groups: GroupDescription[];
  synopsis: string | null;
  tags: Tag[];
  updated_at: string;
  urls: string[];
};

export type GroupCreateInput = {
  aliases?: string | null;
  /** This should be a URL or a base64 encoded data URL */
  back_image?: string | null;
  containing_groups?: GroupDescriptionInput[] | null;
  custom_fields?: Record<string, JsonValue> | null;
  date?: string | null;
  director?: string | null;
  /** Duration in seconds */
  duration?: number | null;
  /** This should be a URL or a base64 encoded data URL */
  front_image?: string | null;
  name: string;
  rating100?: number | null;
  studio_id?: string | null;
  sub_groups?: GroupDescriptionInput[] | null;
  synopsis?: string | null;
  tag_ids?: string[] | null;
  urls?: string[] | null;
};

/** GroupDescription represents a relationship to a group with a description of the relationship */
export type GroupDescription = {
  description: string | null;
  group: Group;
};

export type GroupDescriptionInput = {
  description?: string | null;
  group_id: string;
};

export type GroupDestroyInput = {
  id: string;
};

export type GroupFilterType = {
  AND?: GroupFilterType | null;
  NOT?: GroupFilterType | null;
  OR?: GroupFilterType | null;
  /** Filter by number of containing groups the group has */
  containing_group_count?: IntCriterionInput | null;
  /** Filter by containing groups */
  containing_groups?: HierarchicalMultiCriterionInput | null;
  /** Filter by creation time */
  created_at?: TimestampCriterionInput | null;
  /** Filter by custom fields */
  custom_fields?: CustomFieldCriterionInput[] | null;
  /** Filter by date */
  date?: DateCriterionInput | null;
  director?: StringCriterionInput | null;
  /** Filter by duration (in seconds) */
  duration?: IntCriterionInput | null;
  /** Filter to only include groups missing this property */
  is_missing?: string | null;
  name?: StringCriterionInput | null;
  /** Filter by o-counter */
  o_counter?: IntCriterionInput | null;
  /** Filter to only include groups where performer appears in a scene */
  performers?: MultiCriterionInput | null;
  rating100?: IntCriterionInput | null;
  /** Filter by number of scenes the group has */
  scene_count?: IntCriterionInput | null;
  /** Filter by related scenes that meet this criteria */
  scenes_filter?: SceneFilterType | null;
  /** Filter to only include groups with this studio */
  studios?: HierarchicalMultiCriterionInput | null;
  /** Filter by related studios that meet this criteria */
  studios_filter?: StudioFilterType | null;
  /** Filter by number of sub-groups the group has */
  sub_group_count?: IntCriterionInput | null;
  /** Filter by sub groups */
  sub_groups?: HierarchicalMultiCriterionInput | null;
  synopsis?: StringCriterionInput | null;
  /** Filter by tag count */
  tag_count?: IntCriterionInput | null;
  /** Filter to only include groups with these tags */
  tags?: HierarchicalMultiCriterionInput | null;
  /** Filter by last update time */
  updated_at?: TimestampCriterionInput | null;
  /** Filter by url */
  url?: StringCriterionInput | null;
};

export type GroupSubGroupAddInput = {
  containing_group_id: string;
  /** The index at which to insert the sub groups. If not provided, the sub groups will be appended to the end */
  insert_index?: number | null;
  sub_groups: GroupDescriptionInput[];
};

export type GroupSubGroupRemoveInput = {
  containing_group_id: string;
  sub_group_ids: string[];
};

export type GroupUpdateInput = {
  aliases?: string | null;
  /** This should be a URL or a base64 encoded data URL */
  back_image?: string | null;
  containing_groups?: GroupDescriptionInput[] | null;
  custom_fields?: CustomFieldsInput | null;
  date?: string | null;
  director?: string | null;
  duration?: number | null;
  /** This should be a URL or a base64 encoded data URL */
  front_image?: string | null;
  id: string;
  name?: string | null;
  rating100?: number | null;
  studio_id?: string | null;
  sub_groups?: GroupDescriptionInput[] | null;
  synopsis?: string | null;
  tag_ids?: string[] | null;
  urls?: string[] | null;
};

export type HashAlgorithm =
  | 'MD5'
  /** oshash */
  | 'OSHASH';

export type HierarchicalMultiCriterionInput = {
  depth?: number | null;
  excludes?: string[] | null;
  modifier: CriterionModifier;
  value?: string[] | null;
};

export type HistoryMutationResult = {
  count: number;
  history: string[];
};

export type IdentifyFieldOptions = {
  /** creates missing objects if needed - only applicable for performers, tags and studios */
  createMissing: boolean | null;
  field: string;
  strategy: IdentifyFieldStrategy;
};

export type IdentifyFieldOptionsInput = {
  /** creates missing objects if needed - only applicable for performers, tags and studios */
  createMissing?: boolean | null;
  field: string;
  strategy: IdentifyFieldStrategy;
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
  /** Options defined here override the configured defaults */
  options?: IdentifyMetadataOptionsInput | null;
  /** paths of scenes to identify - ignored if scene ids are set */
  paths?: string[] | null;
  /** scene ids to identify */
  sceneIDs?: string[] | null;
  /** An ordered list of sources to identify items with. Only the first source that finds a match is used. */
  sources: IdentifySourceInput[];
};

export type IdentifyMetadataOptions = {
  /** any fields missing from here are defaulted to MERGE and createMissing false */
  fieldOptions: IdentifyFieldOptions[] | null;
  /**
   * defaults to true if not provided
   *
   * @deprecated Use performerGenders
   */
  includeMalePerformers: boolean | null;
  /** Filter to only include performers with these genders. If not provided, all genders are included. */
  performerGenders: GenderEnum[] | null;
  /** defaults to true if not provided */
  setCoverImage: boolean | null;
  setOrganized: boolean | null;
  /** tag to tag skipped multiple matches with */
  skipMultipleMatchTag: string | null;
  /** defaults to true if not provided */
  skipMultipleMatches: boolean | null;
  /** tag to tag skipped single name performers with */
  skipSingleNamePerformerTag: string | null;
  /** defaults to true if not provided */
  skipSingleNamePerformers: boolean | null;
};

export type IdentifyMetadataOptionsInput = {
  /** any fields missing from here are defaulted to MERGE and createMissing false */
  fieldOptions?: IdentifyFieldOptionsInput[] | null;
  /**
   * defaults to true if not provided
   *
   * @deprecated Use performerGenders
   */
  includeMalePerformers?: boolean | null;
  /** Filter to only include performers with these genders. If not provided, all genders are included. */
  performerGenders?: GenderEnum[] | null;
  /** defaults to true if not provided */
  setCoverImage?: boolean | null;
  setOrganized?: boolean | null;
  /** tag to tag skipped multiple matches with */
  skipMultipleMatchTag?: string | null;
  /** defaults to true if not provided */
  skipMultipleMatches?: boolean | null;
  /** tag to tag skipped single name performers with */
  skipSingleNamePerformerTag?: string | null;
  /** defaults to true if not provided */
  skipSingleNamePerformers?: boolean | null;
};

export type IdentifyMetadataTaskOptions = {
  /** Options defined here override the configured defaults */
  options: IdentifyMetadataOptions | null;
  /** An ordered list of sources to identify items with. Only the first source that finds a match is used. */
  sources: IdentifySource[];
};

export type IdentifySource = {
  /** Options defined for a source override the defaults */
  options: IdentifyMetadataOptions | null;
  source: ScraperSource;
};

export type IdentifySourceInput = {
  /** Options defined for a source override the defaults */
  options?: IdentifyMetadataOptionsInput | null;
  source: ScraperSourceInput;
};

export type Image = {
  code: string | null;
  created_at: string;
  custom_fields: Record<string, JsonValue>;
  date: string | null;
  details: string | null;
  /** @deprecated Use visual_files */
  files: ImageFile[];
  galleries: Gallery[];
  id: string;
  o_counter: number | null;
  organized: boolean;
  paths: ImagePathsType;
  performers: Performer[];
  photographer: string | null;
  rating100: number | null;
  studio: Studio | null;
  tags: Tag[];
  title: string | null;
  updated_at: string;
  /** @deprecated Use urls */
  url: string | null;
  urls: string[];
  visual_files: VisualFile[];
};

export type ImageDestroyInput = {
  delete_file?: boolean | null;
  delete_generated?: boolean | null;
  /** If true, delete the file entry from the database if the file is not assigned to any other objects */
  destroy_file_entry?: boolean | null;
  id: string;
};

export type ImageFile = {
  basename: string;
  created_at: string;
  fingerprint: string | null;
  fingerprints: Fingerprint[];
  format: string;
  height: number;
  id: string;
  mod_time: string;
  parent_folder: Folder;
  /** @deprecated Use parent_folder instead */
  parent_folder_id: string;
  path: string;
  size: number;
  updated_at: string;
  width: number;
  zip_file: BasicFile | null;
  /** @deprecated Use zip_file instead */
  zip_file_id: string | null;
};

export type ImageFileFilterInput = {
  format?: StringCriterionInput | null;
  orientation?: OrientationCriterionInput | null;
  resolution?: ResolutionCriterionInput | null;
};

export type ImageFileType = {
  height: number;
  mod_time: string;
  size: number;
  width: number;
};

export type ImageFilterType = {
  AND?: ImageFilterType | null;
  NOT?: ImageFilterType | null;
  OR?: ImageFilterType | null;
  /** Filter by file checksum */
  checksum?: StringCriterionInput | null;
  /** Filter by studio code */
  code?: StringCriterionInput | null;
  /** Filter by creation time */
  created_at?: TimestampCriterionInput | null;
  /** Filter by custom fields */
  custom_fields?: CustomFieldCriterionInput[] | null;
  /** Filter by date */
  date?: DateCriterionInput | null;
  details?: StringCriterionInput | null;
  /** Filter by file count */
  file_count?: IntCriterionInput | null;
  /** Filter by related files that meet this criteria */
  files_filter?: FileFilterType | null;
  /** Filter to only include images with these galleries */
  galleries?: MultiCriterionInput | null;
  /** Filter by related galleries that meet this criteria */
  galleries_filter?: GalleryFilterType | null;
  /**  Filter by image id */
  id?: IntCriterionInput | null;
  /** Filter to only include images missing this property */
  is_missing?: string | null;
  /** Filter by o-counter */
  o_counter?: IntCriterionInput | null;
  /** Filter by organized */
  organized?: boolean | null;
  /** Filter by orientation */
  orientation?: OrientationCriterionInput | null;
  /** Filter by path */
  path?: StringCriterionInput | null;
  /** Filter images by performer age at time of image */
  performer_age?: IntCriterionInput | null;
  /** Filter by performer count */
  performer_count?: IntCriterionInput | null;
  /** Filter images that have performers that have been favorited */
  performer_favorite?: boolean | null;
  /** Filter to only include images with performers with these tags */
  performer_tags?: HierarchicalMultiCriterionInput | null;
  /** Filter to only include images with these performers */
  performers?: MultiCriterionInput | null;
  /** Filter by related performers that meet this criteria */
  performers_filter?: PerformerFilterType | null;
  /** Filter by file phash distance */
  phash_distance?: PhashDistanceCriterionInput | null;
  /** Filter by photographer */
  photographer?: StringCriterionInput | null;
  rating100?: IntCriterionInput | null;
  /** Filter by resolution */
  resolution?: ResolutionCriterionInput | null;
  /** Filter to only include images with this studio */
  studios?: HierarchicalMultiCriterionInput | null;
  /** Filter by related studios that meet this criteria */
  studios_filter?: StudioFilterType | null;
  /** Filter by tag count */
  tag_count?: IntCriterionInput | null;
  /** Filter to only include images with these tags */
  tags?: HierarchicalMultiCriterionInput | null;
  /** Filter by related tags that meet this criteria */
  tags_filter?: TagFilterType | null;
  title?: StringCriterionInput | null;
  /** Filter by last update time */
  updated_at?: TimestampCriterionInput | null;
  /** Filter by url */
  url?: StringCriterionInput | null;
};

export type ImageLightboxDisplayMode =
  | 'FIT_X'
  | 'FIT_XY'
  | 'ORIGINAL';

export type ImageLightboxScrollMode =
  | 'PAN_Y'
  | 'ZOOM';

export type ImagePathsType = {
  image: string | null;
  preview: string | null;
  thumbnail: string | null;
};

export type ImageUpdateInput = {
  clientMutationId?: string | null;
  code?: string | null;
  custom_fields?: CustomFieldsInput | null;
  date?: string | null;
  details?: string | null;
  gallery_ids?: string[] | null;
  id: string;
  organized?: boolean | null;
  performer_ids?: string[] | null;
  photographer?: string | null;
  primary_file_id?: string | null;
  rating100?: number | null;
  studio_id?: string | null;
  tag_ids?: string[] | null;
  title?: string | null;
  /** @deprecated Use urls */
  url?: string | null;
  urls?: string[] | null;
};

export type ImagesDestroyInput = {
  delete_file?: boolean | null;
  delete_generated?: boolean | null;
  /** If true, delete the file entry from the database if the file is not assigned to any other objects */
  destroy_file_entry?: boolean | null;
  ids: string[];
};

export type ImportDuplicateEnum =
  | 'FAIL'
  | 'IGNORE'
  | 'OVERWRITE';

export type ImportMissingRefEnum =
  | 'CREATE'
  | 'FAIL'
  | 'IGNORE';

export type ImportObjectsInput = {
  duplicateBehaviour: ImportDuplicateEnum;
  file: never;
  missingRefBehaviour: ImportMissingRefEnum;
};

export type IntCriterionInput = {
  modifier: CriterionModifier;
  value: number;
  value2?: number | null;
};

export type Job = {
  addTime: string;
  description: string;
  endTime: string | null;
  error: string | null;
  id: string;
  progress: number | null;
  startTime: string | null;
  status: JobStatus;
  subTasks: string[] | null;
};

export type JobStatus =
  | 'CANCELLED'
  | 'FAILED'
  | 'FINISHED'
  | 'READY'
  | 'RUNNING'
  | 'STOPPING';

export type JobStatusUpdate = {
  job: Job;
  type: JobStatusUpdateType;
};

export type JobStatusUpdateType =
  | 'ADD'
  | 'REMOVE'
  | 'UPDATE';

export type LatestVersion = {
  release_date: string;
  shorthash: string;
  url: string;
  version: string;
};

export type LogEntry = {
  level: LogLevel;
  message: string;
  time: string;
};

export type LogLevel =
  | 'Debug'
  | 'Error'
  | 'Info'
  | 'Progress'
  | 'Trace'
  | 'Warning';

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
  /** valid only for single file id. If empty, existing basename is used */
  destination_basename?: string | null;
  /** valid for single or multiple file ids */
  destination_folder?: string | null;
  /** valid for single or multiple file ids */
  destination_folder_id?: string | null;
  ids: string[];
};

export type Movie = {
  aliases: string | null;
  back_image_path: string | null;
  created_at: string;
  date: string | null;
  director: string | null;
  /** Duration in seconds */
  duration: number | null;
  front_image_path: string | null;
  id: string;
  name: string;
  rating100: number | null;
  scene_count: number;
  scenes: Scene[];
  studio: Studio | null;
  synopsis: string | null;
  tags: Tag[];
  updated_at: string;
  /** @deprecated Use urls */
  url: string | null;
  urls: string[];
};

export type MovieCreateInput = {
  aliases?: string | null;
  /** This should be a URL or a base64 encoded data URL */
  back_image?: string | null;
  date?: string | null;
  director?: string | null;
  /** Duration in seconds */
  duration?: number | null;
  /** This should be a URL or a base64 encoded data URL */
  front_image?: string | null;
  name: string;
  rating100?: number | null;
  studio_id?: string | null;
  synopsis?: string | null;
  tag_ids?: string[] | null;
  /** @deprecated Use urls */
  url?: string | null;
  urls?: string[] | null;
};

export type MovieDestroyInput = {
  id: string;
};

export type MovieFilterType = {
  AND?: MovieFilterType | null;
  NOT?: MovieFilterType | null;
  OR?: MovieFilterType | null;
  /** Filter by creation time */
  created_at?: TimestampCriterionInput | null;
  /** Filter by date */
  date?: DateCriterionInput | null;
  director?: StringCriterionInput | null;
  /** Filter by duration (in seconds) */
  duration?: IntCriterionInput | null;
  /** Filter to only include movies missing this property */
  is_missing?: string | null;
  name?: StringCriterionInput | null;
  /** Filter to only include movies where performer appears in a scene */
  performers?: MultiCriterionInput | null;
  rating100?: IntCriterionInput | null;
  /** Filter by related scenes that meet this criteria */
  scenes_filter?: SceneFilterType | null;
  /** Filter to only include movies with this studio */
  studios?: HierarchicalMultiCriterionInput | null;
  /** Filter by related studios that meet this criteria */
  studios_filter?: StudioFilterType | null;
  synopsis?: StringCriterionInput | null;
  /** Filter by tag count */
  tag_count?: IntCriterionInput | null;
  /** Filter to only include movies with these tags */
  tags?: HierarchicalMultiCriterionInput | null;
  /** Filter by last update time */
  updated_at?: TimestampCriterionInput | null;
  /** Filter by url */
  url?: StringCriterionInput | null;
};

export type MovieUpdateInput = {
  aliases?: string | null;
  /** This should be a URL or a base64 encoded data URL */
  back_image?: string | null;
  date?: string | null;
  director?: string | null;
  duration?: number | null;
  /** This should be a URL or a base64 encoded data URL */
  front_image?: string | null;
  id: string;
  name?: string | null;
  rating100?: number | null;
  studio_id?: string | null;
  synopsis?: string | null;
  tag_ids?: string[] | null;
  /** @deprecated Use urls */
  url?: string | null;
  urls?: string[] | null;
};

export type MultiCriterionInput = {
  excludes?: string[] | null;
  modifier: CriterionModifier;
  value?: string[] | null;
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
  date: string | null;
  metadata: Record<string, JsonValue>;
  name: string;
  package_id: string;
  requires: Package[];
  sourceURL: string;
  /** The version of this package currently available from the remote source */
  source_package: Package | null;
  version: string | null;
};

export type PackageSource = {
  local_path: string | null;
  name: string | null;
  url: string;
};

export type PackageSourceInput = {
  local_path?: string | null;
  name?: string | null;
  url: string;
};

export type PackageSpecInput = {
  id: string;
  sourceURL: string;
};

export type PackageType =
  | 'Plugin'
  | 'Scraper';

export type Performer = {
  alias_list: string[];
  birthdate: string | null;
  career_end: string | null;
  /** @deprecated Use career_start and career_end */
  career_length: string | null;
  career_start: string | null;
  circumcised: CircumcisedEnum | null;
  country: string | null;
  created_at: string;
  custom_fields: Record<string, JsonValue>;
  death_date: string | null;
  details: string | null;
  disambiguation: string | null;
  ethnicity: string | null;
  eye_color: string | null;
  fake_tits: string | null;
  favorite: boolean;
  gallery_count: number;
  gender: GenderEnum | null;
  group_count: number;
  groups: Group[];
  hair_color: string | null;
  height_cm: number | null;
  id: string;
  ignore_auto_tag: boolean;
  image_count: number;
  image_path: string | null;
  /** @deprecated Use urls */
  instagram: string | null;
  measurements: string | null;
  /** @deprecated use group_count instead */
  movie_count: number;
  /** @deprecated use groups instead */
  movies: Movie[];
  name: string;
  o_counter: number | null;
  penis_length: number | null;
  performer_count: number;
  piercings: string | null;
  rating100: number | null;
  scene_count: number;
  scenes: Scene[];
  stash_ids: StashID[];
  tags: Tag[];
  tattoos: string | null;
  /** @deprecated Use urls */
  twitter: string | null;
  updated_at: string;
  /** @deprecated Use urls */
  url: string | null;
  urls: string[] | null;
  weight: number | null;
};

export type PerformerCreateInput = {
  /** Duplicate aliases and those equal to name will be ignored (case-insensitive) */
  alias_list?: string[] | null;
  birthdate?: string | null;
  career_end?: string | null;
  /** @deprecated Use career_start and career_end */
  career_length?: string | null;
  career_start?: string | null;
  circumcised?: CircumcisedEnum | null;
  country?: string | null;
  custom_fields?: Record<string, JsonValue> | null;
  death_date?: string | null;
  details?: string | null;
  disambiguation?: string | null;
  ethnicity?: string | null;
  eye_color?: string | null;
  fake_tits?: string | null;
  favorite?: boolean | null;
  gender?: GenderEnum | null;
  hair_color?: string | null;
  height_cm?: number | null;
  ignore_auto_tag?: boolean | null;
  /** This should be a URL or a base64 encoded data URL */
  image?: string | null;
  /** @deprecated Use urls */
  instagram?: string | null;
  measurements?: string | null;
  name: string;
  penis_length?: number | null;
  piercings?: string | null;
  rating100?: number | null;
  stash_ids?: StashIDInput[] | null;
  tag_ids?: string[] | null;
  tattoos?: string | null;
  /** @deprecated Use urls */
  twitter?: string | null;
  /** @deprecated Use urls */
  url?: string | null;
  urls?: string[] | null;
  weight?: number | null;
};

export type PerformerDestroyInput = {
  id: string;
};

export type PerformerFilterType = {
  AND?: PerformerFilterType | null;
  NOT?: PerformerFilterType | null;
  OR?: PerformerFilterType | null;
  /** Filter by age */
  age?: IntCriterionInput | null;
  /** Filter by aliases */
  aliases?: StringCriterionInput | null;
  /** Filter by birth year */
  birth_year?: IntCriterionInput | null;
  /** Filter by birthdate */
  birthdate?: DateCriterionInput | null;
  /** Filter by career end */
  career_end?: DateCriterionInput | null;
  /**
   * Deprecated: use career_start and career_end. This filter is non-functional.
   *
   * @deprecated Use career_start and career_end
   */
  career_length?: StringCriterionInput | null;
  /** Filter by career start */
  career_start?: DateCriterionInput | null;
  /** Filter by circumcision */
  circumcised?: CircumcisionCriterionInput | null;
  /** Filter by country */
  country?: StringCriterionInput | null;
  /** Filter by creation time */
  created_at?: TimestampCriterionInput | null;
  custom_fields?: CustomFieldCriterionInput[] | null;
  /** Filter by death date */
  death_date?: DateCriterionInput | null;
  /** Filter by death year */
  death_year?: IntCriterionInput | null;
  details?: StringCriterionInput | null;
  disambiguation?: StringCriterionInput | null;
  /** Filter by ethnicity */
  ethnicity?: StringCriterionInput | null;
  /** Filter by eye color */
  eye_color?: StringCriterionInput | null;
  /** Filter by fake tits value */
  fake_tits?: StringCriterionInput | null;
  /** Filter by favorite */
  filter_favorites?: boolean | null;
  /** Filter by related galleries that meet this criteria */
  galleries_filter?: GalleryFilterType | null;
  /** Filter by gallery count */
  gallery_count?: IntCriterionInput | null;
  /** Filter by gender */
  gender?: GenderCriterionInput | null;
  /** Filter by groups where performer appears in scene */
  groups?: HierarchicalMultiCriterionInput | null;
  /** Filter by hair color */
  hair_color?: StringCriterionInput | null;
  /** Filter by height in cm */
  height_cm?: IntCriterionInput | null;
  /** Filter by autotag ignore value */
  ignore_auto_tag?: boolean | null;
  /** Filter by image count */
  image_count?: IntCriterionInput | null;
  /** Filter by related images that meet this criteria */
  images_filter?: ImageFilterType | null;
  /** Filter to only include performers missing this property */
  is_missing?: string | null;
  /** Filter by marker count (via scene) */
  marker_count?: IntCriterionInput | null;
  /** Filter by related scene markers (via scene) that meet this criteria */
  markers_filter?: SceneMarkerFilterType | null;
  /** Filter by measurements */
  measurements?: StringCriterionInput | null;
  name?: StringCriterionInput | null;
  /** Filter by o count */
  o_counter?: IntCriterionInput | null;
  /** Filter by penis length value */
  penis_length?: FloatCriterionInput | null;
  /** Filter by performers where performer appears with another performer in scene/image/gallery */
  performers?: MultiCriterionInput | null;
  /** Filter by piercings */
  piercings?: StringCriterionInput | null;
  /** Filter by play count */
  play_count?: IntCriterionInput | null;
  rating100?: IntCriterionInput | null;
  /** Filter by scene count */
  scene_count?: IntCriterionInput | null;
  /** Filter by related scenes that meet this criteria */
  scenes_filter?: SceneFilterType | null;
  /**
   * Filter by StashID
   *
   * @deprecated use stash_ids_endpoint instead
   */
  stash_id_endpoint?: StashIDCriterionInput | null;
  /** Filter by StashIDs */
  stash_ids_endpoint?: StashIDsCriterionInput | null;
  /** Filter by studios where performer appears in scene/image/gallery */
  studios?: HierarchicalMultiCriterionInput | null;
  /** Filter by tag count */
  tag_count?: IntCriterionInput | null;
  /** Filter to only include performers with these tags */
  tags?: HierarchicalMultiCriterionInput | null;
  /** Filter by related tags that meet this criteria */
  tags_filter?: TagFilterType | null;
  /** Filter by tattoos */
  tattoos?: StringCriterionInput | null;
  /** Filter by last update time */
  updated_at?: TimestampCriterionInput | null;
  /** Filter by url */
  url?: StringCriterionInput | null;
  /** Filter by weight */
  weight?: IntCriterionInput | null;
};

export type PerformerMergeInput = {
  destination: string;
  source: string[];
  values?: PerformerUpdateInput | null;
};

export type PerformerUpdateInput = {
  /** Duplicate aliases and those equal to name will be ignored (case-insensitive) */
  alias_list?: string[] | null;
  birthdate?: string | null;
  career_end?: string | null;
  /** @deprecated Use career_start and career_end */
  career_length?: string | null;
  career_start?: string | null;
  circumcised?: CircumcisedEnum | null;
  country?: string | null;
  custom_fields?: CustomFieldsInput | null;
  death_date?: string | null;
  details?: string | null;
  disambiguation?: string | null;
  ethnicity?: string | null;
  eye_color?: string | null;
  fake_tits?: string | null;
  favorite?: boolean | null;
  gender?: GenderEnum | null;
  hair_color?: string | null;
  height_cm?: number | null;
  id: string;
  ignore_auto_tag?: boolean | null;
  /** This should be a URL or a base64 encoded data URL */
  image?: string | null;
  /** @deprecated Use urls */
  instagram?: string | null;
  measurements?: string | null;
  name?: string | null;
  penis_length?: number | null;
  piercings?: string | null;
  rating100?: number | null;
  stash_ids?: StashIDInput[] | null;
  tag_ids?: string[] | null;
  tattoos?: string | null;
  /** @deprecated Use urls */
  twitter?: string | null;
  /** @deprecated Use urls */
  url?: string | null;
  urls?: string[] | null;
  weight?: number | null;
};

export type PhashDistanceCriterionInput = {
  distance?: number | null;
  modifier: CriterionModifier;
  value: string;
};

export type Plugin = {
  description: string | null;
  enabled: boolean;
  hooks: PluginHook[] | null;
  id: string;
  name: string;
  paths: PluginPaths;
  /**
   * Plugin IDs of plugins that this plugin depends on.
   * Applies only for UI plugins to indicate css/javascript load order.
   */
  requires: string[] | null;
  settings: PluginSetting[] | null;
  tasks: PluginTask[] | null;
  url: string | null;
  version: string | null;
};

export type PluginArgInput = {
  key: string;
  value?: PluginValueInput | null;
};

export type PluginHook = {
  description: string | null;
  hooks: string[] | null;
  name: string;
  plugin: Plugin;
};

export type PluginPaths = {
  css: string[] | null;
  javascript: string[] | null;
};

export type PluginResult = {
  error: string | null;
  result: string | null;
};

export type PluginSetting = {
  description: string | null;
  display_name: string | null;
  name: string;
  type: PluginSettingTypeEnum;
};

export type PluginSettingTypeEnum =
  | 'BOOLEAN'
  | 'NUMBER'
  | 'STRING';

export type PluginTask = {
  description: string | null;
  name: string;
  plugin: Plugin;
};

export type PluginValueInput = {
  a?: PluginValueInput[] | null;
  b?: boolean | null;
  f?: number | null;
  i?: number | null;
  o?: PluginArgInput[] | null;
  str?: string | null;
};

export type PreviewPreset =
  /** X264_FAST */
  | 'fast'
  /** X264_MEDIUM */
  | 'medium'
  /** X264_SLOW */
  | 'slow'
  /** X264_SLOWER */
  | 'slower'
  /** X264_ULTRAFAST */
  | 'ultrafast'
  /** X264_VERYFAST */
  | 'veryfast'
  /** X264_VERYSLOW */
  | 'veryslow';

export type RemoveTempDLNAIPInput = {
  address: string;
};

export type ReorderSubGroupsInput = {
  /** ID of the group to reorder sub groups for */
  group_id: string;
  /** If true, the sub groups will be inserted after the insert_index, otherwise they will be inserted before */
  insert_after?: boolean | null;
  /** The sub-group ID at which to insert the sub groups */
  insert_at_id: string;
  /**
   * IDs of the sub groups to reorder. These must be a subset of the current sub groups.
   * Sub groups will be inserted in this order at the insert_index
   */
  sub_group_ids: string[];
};

export type ResolutionCriterionInput = {
  modifier: CriterionModifier;
  value: ResolutionEnum;
};

export type ResolutionEnum =
  /** 8K */
  | 'EIGHT_K'
  /** 5K */
  | 'FIVE_K'
  /** 4K */
  | 'FOUR_K'
  /** 1080p */
  | 'FULL_HD'
  /** 8K+ */
  | 'HUGE'
  /** 240p */
  | 'LOW'
  /** 1440p */
  | 'QUAD_HD'
  /** 360p */
  | 'R360P'
  /** 7K */
  | 'SEVEN_K'
  /** 6K */
  | 'SIX_K'
  /** 480p */
  | 'STANDARD'
  /** 720p */
  | 'STANDARD_HD'
  /** 144p */
  | 'VERY_LOW'
  /**
   * 1920p
   *
   * @deprecated Use 4K instead
   */
  | 'VR_HD'
  /** 540p */
  | 'WEB_HD';

export type SQLExecResult = {
  /**
   * The integer generated by the database in response to a command.
   * Typically this will be from an "auto increment" column when inserting a new row.
   * Not all databases support this feature, and the syntax of such statements varies.
   */
  last_insert_id: number | null;
  /**
   * The number of rows affected by the query, usually an UPDATE, INSERT, or DELETE.
   * Not all queries or databases support this feature.
   */
  rows_affected: number | null;
};

export type SQLQueryResult = {
  /** The column names, in the order they appear in the result set. */
  columns: string[];
  /** The returned rows. */
  rows: ((JsonValue | null)[])[];
};

export type SaveFilterInput = {
  find_filter?: FindFilterType | null;
  /** provide ID to overwrite existing filter */
  id?: string | null;
  mode: FilterMode;
  name: string;
  object_filter?: Record<string, JsonValue> | null;
  ui_options?: Record<string, JsonValue> | null;
};

export type SavedFilter = {
  /**
   * JSON-encoded filter string
   *
   * @deprecated use find_filter and object_filter instead
   */
  filter: string;
  find_filter: SavedFindFilterType | null;
  id: string;
  mode: FilterMode;
  name: string;
  object_filter: Record<string, JsonValue> | null;
  ui_options: Record<string, JsonValue> | null;
};

export type SavedFindFilterType = {
  direction: SortDirectionEnum | null;
  page: number | null;
  /** use per_page = -1 to indicate all results. Defaults to 25. */
  per_page: number | null;
  q: string | null;
  sort: string | null;
};

/** Filter options for meta data scannning */
export type ScanMetaDataFilterInput = {
  /** If set, files with a modification time before this time point are ignored by the scan */
  minModTime?: string | null;
};

export type ScanMetadataInput = {
  /** Filter options for the scan */
  filter?: ScanMetaDataFilterInput | null;
  paths?: string[] | null;
  /** Forces a rescan on files even if modification time is unchanged */
  rescan?: boolean | null;
  /** Generate image clip previews during scan */
  scanGenerateClipPreviews?: boolean | null;
  /** Generate covers during scan */
  scanGenerateCovers?: boolean | null;
  /** Generate image phashes during scan */
  scanGenerateImagePhashes?: boolean | null;
  /** Generate image previews during scan */
  scanGenerateImagePreviews?: boolean | null;
  /** Generate video phashes during scan */
  scanGeneratePhashes?: boolean | null;
  /** Generate previews during scan */
  scanGeneratePreviews?: boolean | null;
  /** Generate sprites during scan */
  scanGenerateSprites?: boolean | null;
  /** Generate image thumbnails during scan */
  scanGenerateThumbnails?: boolean | null;
};

export type ScanMetadataOptions = {
  /** Forces a rescan on files even if modification time is unchanged */
  rescan: boolean;
  /** Generate image clip previews during scan */
  scanGenerateClipPreviews: boolean;
  /** Generate covers during scan */
  scanGenerateCovers: boolean;
  /** Generate image phashes during scan */
  scanGenerateImagePhashes: boolean | null;
  /** Generate image previews during scan */
  scanGenerateImagePreviews: boolean;
  /** Generate video phashes during scan */
  scanGeneratePhashes: boolean;
  /** Generate previews during scan */
  scanGeneratePreviews: boolean;
  /** Generate sprites during scan */
  scanGenerateSprites: boolean;
  /** Generate image thumbnails during scan */
  scanGenerateThumbnails: boolean;
};

export type Scene = {
  captions: VideoCaption[] | null;
  code: string | null;
  created_at: string;
  custom_fields: Record<string, JsonValue>;
  date: string | null;
  details: string | null;
  director: string | null;
  files: VideoFile[];
  galleries: Gallery[];
  groups: SceneGroup[];
  id: string;
  interactive: boolean;
  interactive_speed: number | null;
  /** The last time play count was updated */
  last_played_at: string | null;
  /** @deprecated Use groups */
  movies: SceneMovie[];
  o_counter: number | null;
  /** Times the o counter was incremented */
  o_history: string[];
  organized: boolean;
  paths: ScenePathsType;
  performers: Performer[];
  /** The number ot times a scene has been played */
  play_count: number | null;
  /** The total time a scene has spent playing */
  play_duration: number | null;
  /** Times a scene was played */
  play_history: string[];
  rating100: number | null;
  /** The time index a scene was left at */
  resume_time: number | null;
  /** Return valid stream paths */
  sceneStreams: SceneStreamEndpoint[];
  scene_markers: SceneMarker[];
  stash_ids: StashID[];
  studio: Studio | null;
  tags: Tag[];
  title: string | null;
  updated_at: string;
  /** @deprecated Use urls */
  url: string | null;
  urls: string[];
};

export type SceneCreateInput = {
  code?: string | null;
  /** This should be a URL or a base64 encoded data URL */
  cover_image?: string | null;
  custom_fields?: Record<string, JsonValue> | null;
  date?: string | null;
  details?: string | null;
  director?: string | null;
  /**
   * The first id will be assigned as primary.
   * Files will be reassigned from existing scenes if applicable.
   * Files must not already be primary for another scene.
   */
  file_ids?: string[] | null;
  gallery_ids?: string[] | null;
  groups?: SceneGroupInput[] | null;
  /** @deprecated Use groups */
  movies?: SceneMovieInput[] | null;
  organized?: boolean | null;
  performer_ids?: string[] | null;
  rating100?: number | null;
  stash_ids?: StashIDInput[] | null;
  studio_id?: string | null;
  tag_ids?: string[] | null;
  title?: string | null;
  /** @deprecated Use urls */
  url?: string | null;
  urls?: string[] | null;
};

export type SceneDestroyInput = {
  delete_file?: boolean | null;
  delete_generated?: boolean | null;
  /** If true, delete the file entry from the database if the file is not assigned to any other objects */
  destroy_file_entry?: boolean | null;
  id: string;
};

export type SceneFileType = {
  audio_codec: string | null;
  bitrate: number | null;
  duration: number | null;
  framerate: number | null;
  height: number | null;
  size: string | null;
  video_codec: string | null;
  width: number | null;
};

export type SceneFilterType = {
  AND?: SceneFilterType | null;
  NOT?: SceneFilterType | null;
  OR?: SceneFilterType | null;
  /** Filter by audio codec */
  audio_codec?: StringCriterionInput | null;
  /** Filter by bit rate */
  bitrate?: IntCriterionInput | null;
  /** Filter by captions */
  captions?: StringCriterionInput | null;
  /** Filter by file checksum */
  checksum?: StringCriterionInput | null;
  code?: StringCriterionInput | null;
  /** Filter by creation time */
  created_at?: TimestampCriterionInput | null;
  custom_fields?: CustomFieldCriterionInput[] | null;
  /** Filter by date */
  date?: DateCriterionInput | null;
  details?: StringCriterionInput | null;
  director?: StringCriterionInput | null;
  /** Filter Scenes by duplication criteria */
  duplicated?: DuplicationCriterionInput | null;
  /** Filter by duration (in seconds) */
  duration?: IntCriterionInput | null;
  /** Filter by file count */
  file_count?: IntCriterionInput | null;
  /** Filter by related files that meet this criteria */
  files_filter?: FileFilterType | null;
  /** Filter by frame rate */
  framerate?: IntCriterionInput | null;
  /** Filter to only include scenes with this gallery */
  galleries?: MultiCriterionInput | null;
  /** Filter by related galleries that meet this criteria */
  galleries_filter?: GalleryFilterType | null;
  /** Filter to only include scenes with this group */
  groups?: HierarchicalMultiCriterionInput | null;
  /** Filter by related groups that meet this criteria */
  groups_filter?: GroupFilterType | null;
  /** Filter to only include scenes which have markers. `true` or `false` */
  has_markers?: string | null;
  id?: IntCriterionInput | null;
  /** Filter by interactive */
  interactive?: boolean | null;
  /** Filter by InteractiveSpeed */
  interactive_speed?: IntCriterionInput | null;
  /** Filter to only include scenes missing this property */
  is_missing?: string | null;
  /** Filter by scene last played time */
  last_played_at?: TimestampCriterionInput | null;
  /** Filter by related markers that meet this criteria */
  markers_filter?: SceneMarkerFilterType | null;
  /**
   * Filter to only include scenes with this movie
   *
   * @deprecated use groups instead
   */
  movies?: MultiCriterionInput | null;
  /**
   * Filter by related movies that meet this criteria
   *
   * @deprecated use groups_filter instead
   */
  movies_filter?: MovieFilterType | null;
  /** Filter by o-counter */
  o_counter?: IntCriterionInput | null;
  /** Filter by organized */
  organized?: boolean | null;
  /** Filter by orientation */
  orientation?: OrientationCriterionInput | null;
  /** Filter by file oshash */
  oshash?: StringCriterionInput | null;
  /** Filter by path */
  path?: StringCriterionInput | null;
  /** Filter scenes by performer age at time of scene */
  performer_age?: IntCriterionInput | null;
  /** Filter by performer count */
  performer_count?: IntCriterionInput | null;
  /** Filter scenes that have performers that have been favorited */
  performer_favorite?: boolean | null;
  /** Filter to only include scenes with performers with these tags */
  performer_tags?: HierarchicalMultiCriterionInput | null;
  /** Filter to only include scenes with these performers */
  performers?: MultiCriterionInput | null;
  /** Filter by related performers that meet this criteria */
  performers_filter?: PerformerFilterType | null;
  /**
   * Filter by file phash
   *
   * @deprecated Use phash_distance instead
   */
  phash?: StringCriterionInput | null;
  /** Filter by file phash distance */
  phash_distance?: PhashDistanceCriterionInput | null;
  /** Filter by play count */
  play_count?: IntCriterionInput | null;
  /** Filter by play duration (in seconds) */
  play_duration?: IntCriterionInput | null;
  rating100?: IntCriterionInput | null;
  /** Filter by resolution */
  resolution?: ResolutionCriterionInput | null;
  /** Filter by resume time */
  resume_time?: IntCriterionInput | null;
  /** Filter by StashID count */
  stash_id_count?: IntCriterionInput | null;
  /**
   * Filter by StashID
   *
   * @deprecated use stash_ids_endpoint instead
   */
  stash_id_endpoint?: StashIDCriterionInput | null;
  /** Filter by StashIDs */
  stash_ids_endpoint?: StashIDsCriterionInput | null;
  /** Filter to only include scenes with this studio */
  studios?: HierarchicalMultiCriterionInput | null;
  /** Filter by related studios that meet this criteria */
  studios_filter?: StudioFilterType | null;
  /** Filter by tag count */
  tag_count?: IntCriterionInput | null;
  /** Filter to only include scenes with these tags */
  tags?: HierarchicalMultiCriterionInput | null;
  /** Filter by related tags that meet this criteria */
  tags_filter?: TagFilterType | null;
  title?: StringCriterionInput | null;
  /** Filter by last update time */
  updated_at?: TimestampCriterionInput | null;
  /** Filter by url */
  url?: StringCriterionInput | null;
  /** Filter by video codec */
  video_codec?: StringCriterionInput | null;
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
  created_at: string;
  /** The optional end time of the marker (in seconds). Supports decimals. */
  end_seconds: number | null;
  id: string;
  /** The path to the preview image for this marker */
  preview: string;
  primary_tag: Tag;
  scene: Scene;
  /** The path to the screenshot image for this marker */
  screenshot: string;
  /** The required start time of the marker (in seconds). Supports decimals. */
  seconds: number;
  /** The path to stream this marker */
  stream: string;
  tags: Tag[];
  title: string;
  updated_at: string;
};

export type SceneMarkerCreateInput = {
  /** The optional end time of the marker (in seconds). Supports decimals. */
  end_seconds?: number | null;
  primary_tag_id: string;
  scene_id: string;
  /** The required start time of the marker (in seconds). Supports decimals. */
  seconds: number;
  tag_ids?: string[] | null;
  title: string;
};

export type SceneMarkerFilterType = {
  /** Filter by creation time */
  created_at?: TimestampCriterionInput | null;
  /** Filter by duration (in seconds) */
  duration?: FloatCriterionInput | null;
  /** Filter to only include scene markers with these performers */
  performers?: MultiCriterionInput | null;
  /** Filter by scene creation time */
  scene_created_at?: TimestampCriterionInput | null;
  /** Filter by scene date */
  scene_date?: DateCriterionInput | null;
  /** Filter by related scenes that meet this criteria */
  scene_filter?: SceneFilterType | null;
  /** Filter to only include scene markers attached to a scene with these tags */
  scene_tags?: HierarchicalMultiCriterionInput | null;
  /** Filter by scene last update time */
  scene_updated_at?: TimestampCriterionInput | null;
  /** Filter to only include scene markers from these scenes */
  scenes?: MultiCriterionInput | null;
  /** Filter to only include scene markers with these tags */
  tags?: HierarchicalMultiCriterionInput | null;
  /** Filter by last update time */
  updated_at?: TimestampCriterionInput | null;
};

export type SceneMarkerTag = {
  scene_markers: SceneMarker[];
  tag: Tag;
};

export type SceneMarkerUpdateInput = {
  /** The end time of the marker (in seconds). Supports decimals. */
  end_seconds?: number | null;
  id: string;
  primary_tag_id?: string | null;
  scene_id?: string | null;
  /** The start time of the marker (in seconds). Supports decimals. */
  seconds?: number | null;
  tag_ids?: string[] | null;
  title?: string | null;
};

export type SceneMergeInput = {
  destination: string;
  o_history?: boolean | null;
  play_history?: boolean | null;
  /**
   * If destination scene has no files, then the primary file of the
   * first source scene will be assigned as primary
   */
  source: string[];
  values?: SceneUpdateInput | null;
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
  capitalizeTitle?: boolean | null;
  ignoreOrganized?: boolean | null;
  ignoreWords?: string[] | null;
  whitespaceCharacters?: string | null;
};

export type SceneParserResult = {
  code: string | null;
  date: string | null;
  details: string | null;
  director: string | null;
  gallery_ids: string[] | null;
  movies: SceneMovieID[] | null;
  performer_ids: string[] | null;
  /** @deprecated Use 1-100 range with rating100 */
  rating: number | null;
  rating100: number | null;
  scene: Scene;
  studio_id: string | null;
  tag_ids: string[] | null;
  title: string | null;
  url: string | null;
};

export type SceneParserResultType = {
  count: number;
  results: SceneParserResult[];
};

export type ScenePathsType = {
  caption: string | null;
  funscript: string | null;
  interactive_heatmap: string | null;
  preview: string | null;
  screenshot: string | null;
  sprite: string | null;
  stream: string | null;
  vtt: string | null;
  webp: string | null;
};

export type SceneStreamEndpoint = {
  label: string | null;
  mime_type: string | null;
  url: string;
};

export type SceneUpdateInput = {
  clientMutationId?: string | null;
  code?: string | null;
  /** This should be a URL or a base64 encoded data URL */
  cover_image?: string | null;
  custom_fields?: CustomFieldsInput | null;
  date?: string | null;
  details?: string | null;
  director?: string | null;
  gallery_ids?: string[] | null;
  groups?: SceneGroupInput[] | null;
  id: string;
  /** @deprecated Use groups */
  movies?: SceneMovieInput[] | null;
  /** @deprecated Unsupported - Use sceneIncrementO/sceneDecrementO */
  o_counter?: number | null;
  organized?: boolean | null;
  performer_ids?: string[] | null;
  /**
   * The number ot times a scene has been played
   *
   * @deprecated Unsupported - Use sceneIncrementPlayCount/sceneDecrementPlayCount
   */
  play_count?: number | null;
  /** The total time a scene has spent playing */
  play_duration?: number | null;
  primary_file_id?: string | null;
  rating100?: number | null;
  /** The time index a scene was left at */
  resume_time?: number | null;
  stash_ids?: StashIDInput[] | null;
  studio_id?: string | null;
  tag_ids?: string[] | null;
  title?: string | null;
  /** @deprecated Use urls */
  url?: string | null;
  urls?: string[] | null;
};

export type ScenesDestroyInput = {
  delete_file?: boolean | null;
  delete_generated?: boolean | null;
  /** If true, delete the file entry from the database if the file is not assigned to any other objects */
  destroy_file_entry?: boolean | null;
  ids: string[];
};

/** Type of the content a scraper generates */
export type ScrapeContentType =
  | 'GALLERY'
  | 'GROUP'
  | 'IMAGE'
  | 'MOVIE'
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
  /** Instructs to query by gallery id */
  gallery_id?: string | null;
  /** Instructs to query by gallery fragment */
  gallery_input?: ScrapedGalleryInput | null;
  /** Instructs to query by string */
  query?: string | null;
};

export type ScrapeSingleGroupInput = {
  /** Instructs to query by group id */
  group_id?: string | null;
  /** Instructs to query by group fragment */
  group_input?: ScrapedGroupInput | null;
  /** Instructs to query by string */
  query?: string | null;
};

export type ScrapeSingleImageInput = {
  /** Instructs to query by image id */
  image_id?: string | null;
  /** Instructs to query by image fragment */
  image_input?: ScrapedImageInput | null;
  /** Instructs to query by string */
  query?: string | null;
};

export type ScrapeSingleMovieInput = {
  /** Instructs to query by movie id */
  movie_id?: string | null;
  /** Instructs to query by movie fragment */
  movie_input?: ScrapedMovieInput | null;
  /** Instructs to query by string */
  query?: string | null;
};

export type ScrapeSinglePerformerInput = {
  /** Instructs to query by performer id */
  performer_id?: string | null;
  /** Instructs to query by performer fragment */
  performer_input?: ScrapedPerformerInput | null;
  /** Instructs to query by string */
  query?: string | null;
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
  /** From existing object */
  | 'FRAGMENT'
  /** From text query */
  | 'NAME'
  /** From URL */
  | 'URL';

/** Scraped Content is the forming union over the different scrapers */
export type ScrapedContent = ScrapedStudio | ScrapedTag | ScrapedScene | ScrapedGallery | ScrapedImage | ScrapedMovie | ScrapedGroup | ScrapedPerformer;

export type ScrapedGallery = {
  code: string | null;
  date: string | null;
  details: string | null;
  performers: ScrapedPerformer[] | null;
  photographer: string | null;
  studio: ScrapedStudio | null;
  tags: ScrapedTag[] | null;
  title: string | null;
  /** @deprecated use urls */
  url: string | null;
  urls: string[] | null;
};

export type ScrapedGalleryInput = {
  code?: string | null;
  date?: string | null;
  details?: string | null;
  photographer?: string | null;
  title?: string | null;
  /** @deprecated use urls */
  url?: string | null;
  urls?: string[] | null;
};

/** A group from a scraping operation... */
export type ScrapedGroup = {
  aliases: string | null;
  /** This should be a base64 encoded data URL */
  back_image: string | null;
  date: string | null;
  director: string | null;
  duration: string | null;
  /** This should be a base64 encoded data URL */
  front_image: string | null;
  name: string | null;
  rating: string | null;
  stored_id: string | null;
  studio: ScrapedStudio | null;
  synopsis: string | null;
  tags: ScrapedTag[] | null;
  urls: string[] | null;
};

export type ScrapedGroupInput = {
  aliases?: string | null;
  date?: string | null;
  director?: string | null;
  duration?: string | null;
  name?: string | null;
  rating?: string | null;
  synopsis?: string | null;
  urls?: string[] | null;
};

export type ScrapedImage = {
  code: string | null;
  date: string | null;
  details: string | null;
  performers: ScrapedPerformer[] | null;
  photographer: string | null;
  studio: ScrapedStudio | null;
  tags: ScrapedTag[] | null;
  title: string | null;
  urls: string[] | null;
};

export type ScrapedImageInput = {
  code?: string | null;
  date?: string | null;
  details?: string | null;
  title?: string | null;
  urls?: string[] | null;
};

/** A movie from a scraping operation... */
export type ScrapedMovie = {
  aliases: string | null;
  /** This should be a base64 encoded data URL */
  back_image: string | null;
  date: string | null;
  director: string | null;
  duration: string | null;
  /** This should be a base64 encoded data URL */
  front_image: string | null;
  name: string | null;
  rating: string | null;
  stored_id: string | null;
  studio: ScrapedStudio | null;
  synopsis: string | null;
  tags: ScrapedTag[] | null;
  /** @deprecated use urls */
  url: string | null;
  urls: string[] | null;
};

export type ScrapedMovieInput = {
  aliases?: string | null;
  date?: string | null;
  director?: string | null;
  duration?: string | null;
  name?: string | null;
  rating?: string | null;
  synopsis?: string | null;
  /** @deprecated use urls */
  url?: string | null;
  urls?: string[] | null;
};

/** A performer from a scraping operation... */
export type ScrapedPerformer = {
  aliases: string | null;
  birthdate: string | null;
  career_end: string | null;
  /** @deprecated Use career_start and career_end */
  career_length: string | null;
  career_start: string | null;
  circumcised: string | null;
  country: string | null;
  death_date: string | null;
  details: string | null;
  disambiguation: string | null;
  ethnicity: string | null;
  eye_color: string | null;
  fake_tits: string | null;
  gender: string | null;
  hair_color: string | null;
  height: string | null;
  /**
   * This should be a base64 encoded data URL
   *
   * @deprecated use images instead
   */
  image: string | null;
  images: string[] | null;
  /** @deprecated use urls */
  instagram: string | null;
  measurements: string | null;
  name: string | null;
  penis_length: string | null;
  piercings: string | null;
  remote_site_id: string | null;
  /** Set if performer matched */
  stored_id: string | null;
  tags: ScrapedTag[] | null;
  tattoos: string | null;
  /** @deprecated use urls */
  twitter: string | null;
  /** @deprecated use urls */
  url: string | null;
  urls: string[] | null;
  weight: string | null;
};

export type ScrapedPerformerInput = {
  aliases?: string | null;
  birthdate?: string | null;
  career_end?: string | null;
  /** @deprecated Use career_start and career_end */
  career_length?: string | null;
  career_start?: string | null;
  circumcised?: string | null;
  country?: string | null;
  death_date?: string | null;
  details?: string | null;
  disambiguation?: string | null;
  ethnicity?: string | null;
  eye_color?: string | null;
  fake_tits?: string | null;
  gender?: string | null;
  hair_color?: string | null;
  height?: string | null;
  /** @deprecated use urls */
  instagram?: string | null;
  measurements?: string | null;
  name?: string | null;
  penis_length?: string | null;
  piercings?: string | null;
  remote_site_id?: string | null;
  /** Set if performer matched */
  stored_id?: string | null;
  tattoos?: string | null;
  /** @deprecated use urls */
  twitter?: string | null;
  /** @deprecated use urls */
  url?: string | null;
  urls?: string[] | null;
  weight?: string | null;
};

export type ScrapedScene = {
  code: string | null;
  date: string | null;
  details: string | null;
  director: string | null;
  duration: number | null;
  file: SceneFileType | null;
  fingerprints: StashBoxFingerprint[] | null;
  groups: ScrapedGroup[] | null;
  /** This should be a base64 encoded data URL */
  image: string | null;
  /** @deprecated use groups */
  movies: ScrapedMovie[] | null;
  performers: ScrapedPerformer[] | null;
  remote_site_id: string | null;
  studio: ScrapedStudio | null;
  tags: ScrapedTag[] | null;
  title: string | null;
  /** @deprecated use urls */
  url: string | null;
  urls: string[] | null;
};

export type ScrapedSceneInput = {
  code?: string | null;
  date?: string | null;
  details?: string | null;
  director?: string | null;
  remote_site_id?: string | null;
  title?: string | null;
  /** @deprecated use urls */
  url?: string | null;
  urls?: string[] | null;
};

export type ScrapedStudio = {
  /** Aliases must be comma-delimited to be parsed correctly */
  aliases: string | null;
  details: string | null;
  image: string | null;
  name: string;
  parent: ScrapedStudio | null;
  remote_site_id: string | null;
  /** Set if studio matched */
  stored_id: string | null;
  tags: ScrapedTag[] | null;
  /** @deprecated use urls */
  url: string | null;
  urls: string[] | null;
};

export type ScrapedTag = {
  alias_list: string[] | null;
  description: string | null;
  name: string;
  parent: ScrapedTag | null;
  /** Remote site ID, if applicable */
  remote_site_id: string | null;
  /** Set if tag matched */
  stored_id: string | null;
};

export type Scraper = {
  /** Details for gallery scraper */
  gallery: ScraperSpec | null;
  /** Details for group scraper */
  group: ScraperSpec | null;
  id: string;
  /** Details for image scraper */
  image: ScraperSpec | null;
  /**
   * Details for movie scraper
   *
   * @deprecated use group
   */
  movie: ScraperSpec | null;
  name: string;
  /** Details for performer scraper */
  performer: ScraperSpec | null;
  /** Details for scene scraper */
  scene: ScraperSpec | null;
};

export type ScraperSource = {
  /** Scraper ID to scrape with. Should be unset if stash_box_endpoint/stash_box_index is set */
  scraper_id: string | null;
  /** Stash-box endpoint */
  stash_box_endpoint: string | null;
  /**
   * Index of the configured stash-box instance to use. Should be unset if scraper_id is set
   *
   * @deprecated use stash_box_endpoint
   */
  stash_box_index: number | null;
};

export type ScraperSourceInput = {
  /** Scraper ID to scrape with. Should be unset if stash_box_endpoint/stash_box_index is set */
  scraper_id?: string | null;
  /** Stash-box endpoint */
  stash_box_endpoint?: string | null;
  /**
   * Index of the configured stash-box instance to use. Should be unset if scraper_id is set
   *
   * @deprecated use stash_box_endpoint
   */
  stash_box_index?: number | null;
};

export type ScraperSpec = {
  supported_scrapes: ScrapeType[];
  /** URLs matching these can be scraped with */
  urls: string[] | null;
};

export type SetDefaultFilterInput = {
  /** null to clear */
  find_filter?: FindFilterType | null;
  mode: FilterMode;
  object_filter?: Record<string, JsonValue> | null;
  ui_options?: Record<string, JsonValue> | null;
};

export type SetFingerprintsInput = {
  type: string;
  /** a null value will remove the fingerprint */
  value?: string | null;
};

export type SetupInput = {
  /** Empty to indicate default - only applicable if storeBlobsInDatabase is false */
  blobsLocation: string;
  /** Empty to indicate default */
  cacheLocation: string;
  /** Empty to indicate $HOME/.stash/config.yml default */
  configLocation: string;
  /** Empty to indicate default */
  databaseFile: string;
  /** Empty to indicate default */
  generatedLocation: string;
  /** True if SFW content mode is enabled */
  sfwContentMode?: boolean | null;
  stashes: StashConfigInput[];
  storeBlobsInDatabase: boolean;
};

export type SortDirectionEnum =
  | 'ASC'
  | 'DESC';

export type StashBox = {
  api_key: string;
  endpoint: string;
  max_requests_per_minute: number;
  name: string;
};

/**
 * Accepts either ids, or a combination of names and stash_ids.
 * If none are set, then all existing items will be tagged.
 */
export type StashBoxBatchTagInput = {
  /** If batch adding studios, should their parent studios also be created? */
  createParent: boolean;
  /**
   * Stash endpoint to use for the tagging
   *
   * @deprecated use stash_box_endpoint
   */
  endpoint?: number | null;
  /** Fields to exclude when executing the tagging */
  exclude_fields?: string[] | null;
  /**
   * IDs in stash of the items to update.
   * If set, names and stash_ids fields will be ignored.
   */
  ids?: string[] | null;
  /** Names of the items in the stash-box instance to search for and create */
  names?: string[] | null;
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
  /** Refresh items already tagged by StashBox if true. Only tag items with no StashBox tagging if false */
  refresh: boolean;
  /** Endpoint of the stash-box instance to use */
  stash_box_endpoint?: string | null;
  /** Stash IDs of the items in the stash-box instance to search for and create */
  stash_ids?: string[] | null;
};

export type StashBoxDraftSubmissionInput = {
  id: string;
  stash_box_endpoint?: string | null;
  /** @deprecated use stash_box_endpoint */
  stash_box_index?: number | null;
};

export type StashBoxFingerprint = {
  algorithm: string;
  duration: number;
  hash: string;
};

export type StashBoxFingerprintSubmissionInput = {
  scene_ids: string[];
  stash_box_endpoint?: string | null;
  /** @deprecated use stash_box_endpoint */
  stash_box_index?: number | null;
};

export type StashBoxInput = {
  api_key: string;
  endpoint: string;
  max_requests_per_minute?: number | null;
  name: string;
};

export type StashBoxPerformerQueryInput = {
  /** Instructs query by scene fingerprints */
  performer_ids?: string[] | null;
  /** Query by query string */
  q?: string | null;
  /** Endpoint of the stash-box instance to use */
  stash_box_endpoint?: string | null;
  /**
   * Index of the configured stash-box instance to use
   *
   * @deprecated use stash_box_endpoint
   */
  stash_box_index?: number | null;
};

export type StashBoxPerformerQueryResult = {
  query: string;
  results: ScrapedPerformer[];
};

export type StashBoxSceneQueryInput = {
  /** Query by query string */
  q?: string | null;
  /** Instructs query by scene fingerprints */
  scene_ids?: string[] | null;
  /** Endpoint of the stash-box instance to use */
  stash_box_endpoint?: string | null;
  /**
   * Index of the configured stash-box instance to use
   *
   * @deprecated use stash_box_endpoint
   */
  stash_box_index?: number | null;
};

export type StashBoxValidationResult = {
  status: string;
  valid: boolean;
};

export type StashConfig = {
  excludeImage: boolean;
  excludeVideo: boolean;
  path: string;
};

/** Stash configuration details */
export type StashConfigInput = {
  excludeImage: boolean;
  excludeVideo: boolean;
  path: string;
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
  modifier: CriterionModifier;
  stash_id?: string | null;
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
  modifier: CriterionModifier;
  stash_ids?: (string | null)[] | null;
};

export type StatsResultType = {
  gallery_count: number;
  group_count: number;
  image_count: number;
  images_size: number;
  /** @deprecated use group_count instead */
  movie_count: number;
  performer_count: number;
  scene_count: number;
  scenes_duration: number;
  scenes_played: number;
  scenes_size: number;
  studio_count: number;
  tag_count: number;
  total_o_count: number;
  total_play_count: number;
  total_play_duration: number;
};

export type StreamingResolutionEnum =
  /** 4k */
  | 'FOUR_K'
  /** 1080p */
  | 'FULL_HD'
  /** 240p */
  | 'LOW'
  /** Original */
  | 'ORIGINAL'
  /** 480p */
  | 'STANDARD'
  /** 720p */
  | 'STANDARD_HD';

export type StringCriterionInput = {
  modifier: CriterionModifier;
  value: string;
};

export type Studio = {
  aliases: string[];
  child_studios: Studio[];
  created_at: string;
  custom_fields: Record<string, JsonValue>;
  details: string | null;
  favorite: boolean;
  gallery_count: number;
  group_count: number;
  groups: Group[];
  id: string;
  ignore_auto_tag: boolean;
  image_count: number;
  image_path: string | null;
  /** @deprecated use group_count instead */
  movie_count: number;
  /** @deprecated use groups instead */
  movies: Movie[];
  name: string;
  o_counter: number | null;
  organized: boolean;
  parent_studio: Studio | null;
  performer_count: number;
  rating100: number | null;
  scene_count: number;
  stash_ids: StashID[];
  tags: Tag[];
  updated_at: string;
  /** @deprecated Use urls */
  url: string | null;
  urls: string[];
};

export type StudioCreateInput = {
  /** Duplicate aliases and those equal to name will be ignored (case-insensitive) */
  aliases?: string[] | null;
  custom_fields?: Record<string, JsonValue> | null;
  details?: string | null;
  favorite?: boolean | null;
  ignore_auto_tag?: boolean | null;
  /** This should be a URL or a base64 encoded data URL */
  image?: string | null;
  name: string;
  organized?: boolean | null;
  parent_id?: string | null;
  rating100?: number | null;
  stash_ids?: StashIDInput[] | null;
  tag_ids?: string[] | null;
  /** @deprecated Use urls */
  url?: string | null;
  urls?: string[] | null;
};

export type StudioDestroyInput = {
  id: string;
};

export type StudioFilterType = {
  AND?: StudioFilterType | null;
  NOT?: StudioFilterType | null;
  OR?: StudioFilterType | null;
  /** Filter by studio aliases */
  aliases?: StringCriterionInput | null;
  /** Filter by subsidiary studio count */
  child_count?: IntCriterionInput | null;
  /** Filter by creation time */
  created_at?: TimestampCriterionInput | null;
  custom_fields?: CustomFieldCriterionInput[] | null;
  details?: StringCriterionInput | null;
  /** Filter by favorite */
  favorite?: boolean | null;
  /** Filter by related galleries that meet this criteria */
  galleries_filter?: GalleryFilterType | null;
  /** Filter by gallery count */
  gallery_count?: IntCriterionInput | null;
  /** Filter by group count */
  group_count?: IntCriterionInput | null;
  /** Filter by related groups that meet this criteria */
  groups_filter?: GroupFilterType | null;
  /** Filter by autotag ignore value */
  ignore_auto_tag?: boolean | null;
  /** Filter by image count */
  image_count?: IntCriterionInput | null;
  /** Filter by related images that meet this criteria */
  images_filter?: ImageFilterType | null;
  /** Filter to only include studios missing this property */
  is_missing?: string | null;
  name?: StringCriterionInput | null;
  /** Filter by organized */
  organized?: boolean | null;
  /** Filter to only include studios with this parent studio */
  parents?: MultiCriterionInput | null;
  rating100?: IntCriterionInput | null;
  /** Filter by scene count */
  scene_count?: IntCriterionInput | null;
  /** Filter by related scenes that meet this criteria */
  scenes_filter?: SceneFilterType | null;
  /**
   * Filter by StashID
   *
   * @deprecated use stash_ids_endpoint instead
   */
  stash_id_endpoint?: StashIDCriterionInput | null;
  /** Filter by StashIDs */
  stash_ids_endpoint?: StashIDsCriterionInput | null;
  /** Filter by tag count */
  tag_count?: IntCriterionInput | null;
  /** Filter to only include studios with these tags */
  tags?: HierarchicalMultiCriterionInput | null;
  /** Filter by last update time */
  updated_at?: TimestampCriterionInput | null;
  /** Filter by url */
  url?: StringCriterionInput | null;
};

export type StudioUpdateInput = {
  /** Duplicate aliases and those equal to name will be ignored (case-insensitive) */
  aliases?: string[] | null;
  custom_fields?: CustomFieldsInput | null;
  details?: string | null;
  favorite?: boolean | null;
  id: string;
  ignore_auto_tag?: boolean | null;
  /** This should be a URL or a base64 encoded data URL */
  image?: string | null;
  name?: string | null;
  organized?: boolean | null;
  parent_id?: string | null;
  rating100?: number | null;
  stash_ids?: StashIDInput[] | null;
  tag_ids?: string[] | null;
  /** @deprecated Use urls */
  url?: string | null;
  urls?: string[] | null;
};

export type SystemStatus = {
  appSchema: number;
  configPath: string | null;
  databasePath: string | null;
  databaseSchema: number | null;
  ffmpegPath: string | null;
  ffprobePath: string | null;
  homeDir: string;
  os: string;
  status: SystemStatusEnum;
  workingDir: string;
};

export type SystemStatusEnum =
  | 'NEEDS_MIGRATION'
  | 'OK'
  | 'SETUP';

export type Tag = {
  aliases: string[];
  child_count: number;
  children: Tag[];
  created_at: string;
  custom_fields: Record<string, JsonValue>;
  description: string | null;
  favorite: boolean;
  gallery_count: number;
  group_count: number;
  id: string;
  ignore_auto_tag: boolean;
  image_count: number;
  image_path: string | null;
  /** @deprecated use group_count instead */
  movie_count: number;
  name: string;
  parent_count: number;
  parents: Tag[];
  performer_count: number;
  scene_count: number;
  scene_marker_count: number;
  /** Value that does not appear in the UI but overrides name for sorting */
  sort_name: string | null;
  stash_ids: StashID[];
  studio_count: number;
  updated_at: string;
};

export type TagCreateInput = {
  /** Duplicate aliases and those equal to name will be ignored (case-insensitive) */
  aliases?: string[] | null;
  child_ids?: string[] | null;
  custom_fields?: Record<string, JsonValue> | null;
  description?: string | null;
  favorite?: boolean | null;
  ignore_auto_tag?: boolean | null;
  /** This should be a URL or a base64 encoded data URL */
  image?: string | null;
  name: string;
  parent_ids?: string[] | null;
  /** Value that does not appear in the UI but overrides name for sorting */
  sort_name?: string | null;
  stash_ids?: StashIDInput[] | null;
};

export type TagDestroyInput = {
  id: string;
};

export type TagFilterType = {
  AND?: TagFilterType | null;
  NOT?: TagFilterType | null;
  OR?: TagFilterType | null;
  /** Filter by tag aliases */
  aliases?: StringCriterionInput | null;
  /** Filter by number of child tags the tag has */
  child_count?: IntCriterionInput | null;
  /** Filter by child tags */
  children?: HierarchicalMultiCriterionInput | null;
  /** Filter by creation time */
  created_at?: TimestampCriterionInput | null;
  custom_fields?: CustomFieldCriterionInput[] | null;
  /** Filter by tag description */
  description?: StringCriterionInput | null;
  /** Filter by favorite */
  favorite?: boolean | null;
  /** Filter by related galleries that meet this criteria */
  galleries_filter?: GalleryFilterType | null;
  /** Filter by number of galleries with this tag */
  gallery_count?: IntCriterionInput | null;
  /** Filter by number of group with this tag */
  group_count?: IntCriterionInput | null;
  /** Filter by related groups that meet this criteria */
  groups_filter?: GroupFilterType | null;
  /** Filter by autotag ignore value */
  ignore_auto_tag?: boolean | null;
  /** Filter by number of images with this tag */
  image_count?: IntCriterionInput | null;
  /** Filter by related images that meet this criteria */
  images_filter?: ImageFilterType | null;
  /** Filter to only include tags missing this property */
  is_missing?: string | null;
  /** Filter by number of markers with this tag */
  marker_count?: IntCriterionInput | null;
  /** Filter by related scene markers that meet this criteria */
  markers_filter?: SceneMarkerFilterType | null;
  /** Filter by number of movies with this tag */
  movie_count?: IntCriterionInput | null;
  /** Filter by tag name */
  name?: StringCriterionInput | null;
  /** Filter by number of parent tags the tag has */
  parent_count?: IntCriterionInput | null;
  /** Filter by parent tags */
  parents?: HierarchicalMultiCriterionInput | null;
  /** Filter by number of performers with this tag */
  performer_count?: IntCriterionInput | null;
  /** Filter by related performers that meet this criteria */
  performers_filter?: PerformerFilterType | null;
  /** Filter by number of scenes with this tag */
  scene_count?: IntCriterionInput | null;
  /** Filter by related scenes that meet this criteria */
  scenes_filter?: SceneFilterType | null;
  /** Filter by tag sort_name */
  sort_name?: StringCriterionInput | null;
  /**
   * Filter by StashID
   *
   * @deprecated use stash_ids_endpoint instead
   */
  stash_id_endpoint?: StashIDCriterionInput | null;
  /** Filter by StashID */
  stash_ids_endpoint?: StashIDsCriterionInput | null;
  /** Filter by number of studios with this tag */
  studio_count?: IntCriterionInput | null;
  /** Filter by related studios that meet this criteria */
  studios_filter?: StudioFilterType | null;
  /** Filter by last update time */
  updated_at?: TimestampCriterionInput | null;
};

export type TagUpdateInput = {
  /** Duplicate aliases and those equal to name will be ignored (case-insensitive) */
  aliases?: string[] | null;
  child_ids?: string[] | null;
  custom_fields?: CustomFieldsInput | null;
  description?: string | null;
  favorite?: boolean | null;
  id: string;
  ignore_auto_tag?: boolean | null;
  /** This should be a URL or a base64 encoded data URL */
  image?: string | null;
  name?: string | null;
  parent_ids?: string[] | null;
  /** Value that does not appear in the UI but overrides name for sorting */
  sort_name?: string | null;
  stash_ids?: StashIDInput[] | null;
};

export type TagsMergeInput = {
  destination: string;
  source: string[];
  values?: TagUpdateInput | null;
};

export type TimestampCriterionInput = {
  modifier: CriterionModifier;
  value: string;
  value2?: string | null;
};

export type Version = {
  build_time: string;
  hash: string;
  version: string | null;
};

export type VideoCaption = {
  caption_type: string;
  language_code: string;
};

export type VideoFile = {
  audio_codec: string;
  basename: string;
  bit_rate: number;
  created_at: string;
  duration: number;
  fingerprint: string | null;
  fingerprints: Fingerprint[];
  format: string;
  frame_rate: number;
  height: number;
  id: string;
  mod_time: string;
  parent_folder: Folder;
  /** @deprecated Use parent_folder instead */
  parent_folder_id: string;
  path: string;
  size: number;
  updated_at: string;
  video_codec: string;
  width: number;
  zip_file: BasicFile | null;
  /** @deprecated Use zip_file instead */
  zip_file_id: string | null;
};

export type VideoFileFilterInput = {
  audio_codec?: StringCriterionInput | null;
  bitrate?: IntCriterionInput | null;
  captions?: StringCriterionInput | null;
  /** in seconds */
  duration?: IntCriterionInput | null;
  format?: StringCriterionInput | null;
  framerate?: IntCriterionInput | null;
  interactive?: boolean | null;
  interactive_speed?: IntCriterionInput | null;
  orientation?: OrientationCriterionInput | null;
  resolution?: ResolutionCriterionInput | null;
  video_codec?: StringCriterionInput | null;
};

export type VisualFile = VideoFile | ImageFile;

export type Queries = {
  /** @deprecated Use findGalleries instead */
  allGalleries: { args: Record<string, never>; result: Gallery[] };
  /** @deprecated Use findImages instead */
  allImages: { args: Record<string, never>; result: Image[] };
  /** @deprecated Use findGroups instead */
  allMovies: { args: Record<string, never>; result: Movie[] };
  allPerformers: { args: Record<string, never>; result: Performer[] };
  /** @deprecated Use findSceneMarkers instead */
  allSceneMarkers: { args: Record<string, never>; result: SceneMarker[] };
  /** @deprecated Use findScenes instead */
  allScenes: { args: Record<string, never>; result: Scene[] };
  /** @deprecated Use findStudios instead */
  allStudios: { args: Record<string, never>; result: Studio[] };
  /** @deprecated Use findTags instead */
  allTags: { args: Record<string, never>; result: Tag[] };
  /** List available packages */
  availablePackages: { args: { source: string; type: PackageType }; result: Package[] };
  /** Returns the current, complete configuration */
  configuration: { args: Record<string, never>; result: ConfigResult };
  /** Returns an array of paths for the given path */
  directory: { args: { locale?: string | null; path?: string | null }; result: Directory };
  dlnaStatus: { args: Record<string, never>; result: DLNAStatus };
  /** @deprecated default filter now stored in UI config */
  findDefaultFilter: { args: { mode: FilterMode }; result: SavedFilter | null };
  /**
   * Returns any groups of scenes that are perceptual duplicates within the queried distance
   * and the difference between their duration is smaller than durationDiff
   */
  findDuplicateScenes: { args: { distance?: number | null; duration_diff?: number | null }; result: Scene[][] };
  /** Find a file by its id or path */
  findFile: { args: { id?: string | null; path?: string | null }; result: BaseFile };
  /** Queries for Files */
  findFiles: { args: { file_filter?: FileFilterType | null; filter?: FindFilterType | null; ids?: string[] | null }; result: FindFilesResultType };
  /** Find a file by its id or path */
  findFolder: { args: { id?: string | null; path?: string | null }; result: Folder };
  /** Queries for Files */
  findFolders: { args: { filter?: FindFilterType | null; folder_filter?: FolderFilterType | null; ids?: string[] | null }; result: FindFoldersResultType };
  findGalleries: { args: { filter?: FindFilterType | null; gallery_filter?: GalleryFilterType | null; ids?: string[] | null }; result: FindGalleriesResultType };
  findGallery: { args: { id: string }; result: Gallery | null };
  /** Find a group by ID */
  findGroup: { args: { id: string }; result: Group | null };
  /** A function which queries Group objects */
  findGroups: { args: { filter?: FindFilterType | null; group_filter?: GroupFilterType | null; ids?: string[] | null }; result: FindGroupsResultType };
  findImage: { args: { checksum?: string | null; id?: string | null }; result: Image | null };
  /** A function which queries Scene objects */
  findImages: { args: { filter?: FindFilterType | null; ids?: string[] | null; image_filter?: ImageFilterType | null; image_ids?: number[] | null }; result: FindImagesResultType };
  findJob: { args: { input: FindJobInput }; result: Job | null };
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
  findMovies: { args: { filter?: FindFilterType | null; ids?: string[] | null; movie_filter?: MovieFilterType | null }; result: FindMoviesResultType };
  /** Find a performer by ID */
  findPerformer: { args: { id: string }; result: Performer | null };
  /** A function which queries Performer objects */
  findPerformers: { args: { filter?: FindFilterType | null; ids?: string[] | null; performer_filter?: PerformerFilterType | null; performer_ids?: number[] | null }; result: FindPerformersResultType };
  findSavedFilter: { args: { id: string }; result: SavedFilter | null };
  findSavedFilters: { args: { mode?: FilterMode | null }; result: SavedFilter[] };
  /** Find a scene by ID or Checksum */
  findScene: { args: { checksum?: string | null; id?: string | null }; result: Scene | null };
  findSceneByHash: { args: { input: SceneHashInput }; result: Scene | null };
  /** A function which queries SceneMarker objects */
  findSceneMarkers: { args: { filter?: FindFilterType | null; ids?: string[] | null; scene_marker_filter?: SceneMarkerFilterType | null }; result: FindSceneMarkersResultType };
  /** A function which queries Scene objects */
  findScenes: { args: { filter?: FindFilterType | null; ids?: string[] | null; scene_filter?: SceneFilterType | null; scene_ids?: number[] | null }; result: FindScenesResultType };
  findScenesByPathRegex: { args: { filter?: FindFilterType | null }; result: FindScenesResultType };
  /** Find a studio by ID */
  findStudio: { args: { id: string }; result: Studio | null };
  /** A function which queries Studio objects */
  findStudios: { args: { filter?: FindFilterType | null; ids?: string[] | null; studio_filter?: StudioFilterType | null }; result: FindStudiosResultType };
  findTag: { args: { id: string }; result: Tag | null };
  findTags: { args: { filter?: FindFilterType | null; ids?: string[] | null; tag_filter?: TagFilterType | null }; result: FindTagsResultType };
  /** List installed packages */
  installedPackages: { args: { type: PackageType }; result: Package[] };
  jobQueue: { args: Record<string, never>; result: Job[] | null };
  latestversion: { args: Record<string, never>; result: LatestVersion };
  /** List available scrapers */
  listScrapers: { args: { types: ScrapeContentType[] }; result: Scraper[] };
  logs: { args: Record<string, never>; result: LogEntry[] };
  /** Get marker strings */
  markerStrings: { args: { q?: string | null; sort?: string | null }; result: (MarkerStringsResultType | null)[] };
  /** Retrieve random scene markers for the wall */
  markerWall: { args: { q?: string | null }; result: SceneMarker[] };
  parseSceneFilenames: { args: { config: SceneParserInput; filter?: FindFilterType | null }; result: SceneParserResultType };
  /** List available plugin operations */
  pluginTasks: { args: Record<string, never>; result: PluginTask[] | null };
  /** List loaded plugins */
  plugins: { args: Record<string, never>; result: Plugin[] | null };
  /** Organize scene markers by tag for a given scene ID */
  sceneMarkerTags: { args: { scene_id: string }; result: SceneMarkerTag[] };
  /** Return valid stream paths */
  sceneStreams: { args: { id?: string | null }; result: SceneStreamEndpoint[] };
  /** Retrieve random scenes for the wall */
  sceneWall: { args: { q?: string | null }; result: Scene[] };
  /** Scrapes a complete gallery record based on a URL */
  scrapeGalleryURL: { args: { url: string }; result: ScrapedGallery | null };
  /** Scrapes a complete group record based on a URL */
  scrapeGroupURL: { args: { url: string }; result: ScrapedGroup | null };
  /** Scrapes a complete image record based on a URL */
  scrapeImageURL: { args: { url: string }; result: ScrapedImage | null };
  /**
   * Scrapes a complete movie record based on a URL
   *
   * @deprecated Use scrapeGroupURL instead
   */
  scrapeMovieURL: { args: { url: string }; result: ScrapedMovie | null };
  /** Scrape for multiple performers */
  scrapeMultiPerformers: { args: { input: ScrapeMultiPerformersInput; source: ScraperSourceInput }; result: ScrapedPerformer[][] };
  /** Scrape for multiple scenes */
  scrapeMultiScenes: { args: { input: ScrapeMultiScenesInput; source: ScraperSourceInput }; result: ScrapedScene[][] };
  /** Scrapes a complete performer record based on a URL */
  scrapePerformerURL: { args: { url: string }; result: ScrapedPerformer | null };
  /** Scrapes a complete scene record based on a URL */
  scrapeSceneURL: { args: { url: string }; result: ScrapedScene | null };
  /** Scrape for a single gallery */
  scrapeSingleGallery: { args: { input: ScrapeSingleGalleryInput; source: ScraperSourceInput }; result: ScrapedGallery[] };
  /** Scrape for a single group */
  scrapeSingleGroup: { args: { input: ScrapeSingleGroupInput; source: ScraperSourceInput }; result: ScrapedGroup[] };
  /** Scrape for a single image */
  scrapeSingleImage: { args: { input: ScrapeSingleImageInput; source: ScraperSourceInput }; result: ScrapedImage[] };
  /**
   * Scrape for a single movie
   *
   * @deprecated Use scrapeSingleGroup instead
   */
  scrapeSingleMovie: { args: { input: ScrapeSingleMovieInput; source: ScraperSourceInput }; result: ScrapedMovie[] };
  /** Scrape for a single performer */
  scrapeSinglePerformer: { args: { input: ScrapeSinglePerformerInput; source: ScraperSourceInput }; result: ScrapedPerformer[] };
  /** Scrape for a single scene */
  scrapeSingleScene: { args: { input: ScrapeSingleSceneInput; source: ScraperSourceInput }; result: ScrapedScene[] };
  /** Scrape for a single studio */
  scrapeSingleStudio: { args: { input: ScrapeSingleStudioInput; source: ScraperSourceInput }; result: ScrapedStudio[] };
  /** Scrape for a single tag */
  scrapeSingleTag: { args: { input: ScrapeSingleTagInput; source: ScraperSourceInput }; result: ScrapedTag[] };
  /** Scrapes content based on a URL */
  scrapeURL: { args: { ty: ScrapeContentType; url: string }; result: ScrapedContent | null };
  /** Get stats */
  stats: { args: Record<string, never>; result: StatsResultType };
  systemStatus: { args: Record<string, never>; result: SystemStatus };
  validateStashBoxCredentials: { args: { input: StashBoxInput }; result: StashBoxValidationResult };
  version: { args: Record<string, never>; result: Version };
};

export type Mutations = {
  addGalleryImages: { args: { input: GalleryAddInput }; result: boolean };
  addGroupSubGroups: { args: { input: GroupSubGroupAddInput }; result: boolean };
  /** Enables an IP address for DLNA for an optional duration */
  addTempDLNAIP: { args: { input: AddTempDLNAIPInput }; result: boolean };
  /** Anonymise the database in a separate file. Optionally returns a link to download the database file */
  anonymiseDatabase: { args: { input: AnonymiseDatabaseInput }; result: string | null };
  /** Backup the database. Optionally returns a link to download the database file */
  backupDatabase: { args: { input: BackupDatabaseInput }; result: string | null };
  bulkGalleryUpdate: { args: { input: BulkGalleryUpdateInput }; result: Gallery[] | null };
  bulkGroupUpdate: { args: { input: BulkGroupUpdateInput }; result: Group[] | null };
  bulkImageUpdate: { args: { input: BulkImageUpdateInput }; result: Image[] | null };
  /** @deprecated Use bulkGroupUpdate instead */
  bulkMovieUpdate: { args: { input: BulkMovieUpdateInput }; result: Movie[] | null };
  bulkPerformerUpdate: { args: { input: BulkPerformerUpdateInput }; result: Performer[] | null };
  bulkSceneMarkerUpdate: { args: { input: BulkSceneMarkerUpdateInput }; result: SceneMarker[] | null };
  bulkSceneUpdate: { args: { input: BulkSceneUpdateInput }; result: Scene[] | null };
  bulkStudioUpdate: { args: { input: BulkStudioUpdateInput }; result: Studio[] | null };
  bulkTagUpdate: { args: { input: BulkTagUpdateInput }; result: Tag[] | null };
  configureDLNA: { args: { input: ConfigDLNAInput }; result: ConfigDLNAResult };
  configureDefaults: { args: { input: ConfigDefaultSettingsInput }; result: ConfigDefaultSettingsResult };
  /** Change general configuration options */
  configureGeneral: { args: { input: ConfigGeneralInput }; result: ConfigGeneralResult };
  configureInterface: { args: { input: ConfigInterfaceInput }; result: ConfigInterfaceResult };
  /** overwrites the entire plugin configuration for the given plugin */
  configurePlugin: { args: { input: Record<string, JsonValue>; plugin_id: string }; result: Record<string, JsonValue> };
  configureScraping: { args: { input: ConfigScrapingInput }; result: ConfigScrapingResult };
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
  deleteFiles: { args: { ids: string[] }; result: boolean };
  /** Deletes file entries from the database without deleting the files from the filesystem */
  destroyFiles: { args: { ids: string[] }; result: boolean };
  destroySavedFilter: { args: { input: DestroyFilterInput }; result: boolean };
  /** Disables DLNA for an optional duration. Has no effect if DLNA is disabled by default */
  disableDLNA: { args: { input: DisableDLNAInput }; result: boolean };
  /** Downloads and installs ffmpeg and ffprobe binaries into the configuration directory. Returns the job ID. */
  downloadFFMpeg: { args: Record<string, never>; result: string };
  /** Enables DLNA for an optional duration. Has no effect if DLNA is enabled by default */
  enableDLNA: { args: { input: EnableDLNAInput }; result: boolean };
  /** DANGEROUS: Execute an arbitrary SQL statement without returning any rows. */
  execSQL: { args: { args?: (JsonValue | null)[] | null; sql: string }; result: SQLExecResult };
  /** Returns a link to download the result */
  exportObjects: { args: { input: ExportObjectsInput }; result: string | null };
  fileSetFingerprints: { args: { input: FileSetFingerprintsInput }; result: boolean };
  galleriesUpdate: { args: { input: GalleryUpdateInput[] }; result: (Gallery | null)[] | null };
  galleryChapterCreate: { args: { input: GalleryChapterCreateInput }; result: GalleryChapter | null };
  galleryChapterDestroy: { args: { id: string }; result: boolean };
  galleryChapterUpdate: { args: { input: GalleryChapterUpdateInput }; result: GalleryChapter | null };
  galleryCreate: { args: { input: GalleryCreateInput }; result: Gallery | null };
  galleryDestroy: { args: { input: GalleryDestroyInput }; result: boolean };
  galleryUpdate: { args: { input: GalleryUpdateInput }; result: Gallery | null };
  /** Generate and set (or clear) API key */
  generateAPIKey: { args: { input: GenerateAPIKeyInput }; result: string };
  groupCreate: { args: { input: GroupCreateInput }; result: Group | null };
  groupDestroy: { args: { input: GroupDestroyInput }; result: boolean };
  groupUpdate: { args: { input: GroupUpdateInput }; result: Group | null };
  groupsDestroy: { args: { ids: string[] }; result: boolean };
  /** Decrements the o-counter for an image. Returns the new value */
  imageDecrementO: { args: { id: string }; result: number };
  imageDestroy: { args: { input: ImageDestroyInput }; result: boolean };
  /** Increments the o-counter for an image. Returns the new value */
  imageIncrementO: { args: { id: string }; result: number };
  /** Resets the o-counter for a image to 0. Returns the new value */
  imageResetO: { args: { id: string }; result: number };
  imageUpdate: { args: { input: ImageUpdateInput }; result: Image | null };
  imagesDestroy: { args: { input: ImagesDestroyInput }; result: boolean };
  imagesUpdate: { args: { input: ImageUpdateInput[] }; result: (Image | null)[] | null };
  /** Performs an incremental import. Returns the job ID */
  importObjects: { args: { input: ImportObjectsInput }; result: string };
  /**
   * Installs the given packages.
   * If a package is already installed, it will be updated if needed..
   * If an error occurs when installing a package, the job will continue to install the remaining packages.
   * Returns the job ID
   */
  installPackages: { args: { packages: PackageSpecInput[]; type: PackageType }; result: string };
  /** Start auto-tagging. Returns the job ID */
  metadataAutoTag: { args: { input: AutoTagMetadataInput }; result: string };
  /** Clean metadata. Returns the job ID */
  metadataClean: { args: { input: CleanMetadataInput }; result: string };
  /** Clean generated files. Returns the job ID */
  metadataCleanGenerated: { args: { input: CleanGeneratedInput }; result: string };
  /** Start a full export. Outputs to the metadata directory. Returns the job ID */
  metadataExport: { args: Record<string, never>; result: string };
  /** Start generating content. Returns the job ID */
  metadataGenerate: { args: { input: GenerateMetadataInput }; result: string };
  /** Identifies scenes using scrapers. Returns the job ID */
  metadataIdentify: { args: { input: IdentifyMetadataInput }; result: string };
  /** Start an full import. Completely wipes the database and imports from the metadata directory. Returns the job ID */
  metadataImport: { args: Record<string, never>; result: string };
  /** Start a scan. Returns the job ID */
  metadataScan: { args: { input: ScanMetadataInput }; result: string };
  /** Migrates the schema to the required version. Returns the job ID */
  migrate: { args: { input: MigrateInput }; result: string };
  /** Migrates blobs from the old storage system to the current one */
  migrateBlobs: { args: { input: MigrateBlobsInput }; result: string };
  /** Migrate generated files for the current hash naming */
  migrateHashNaming: { args: Record<string, never>; result: string };
  /** Migrates legacy scene screenshot files into the blob storage */
  migrateSceneScreenshots: { args: { input: MigrateSceneScreenshotsInput }; result: string };
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
  /** @deprecated Use groupCreate instead */
  movieCreate: { args: { input: MovieCreateInput }; result: Movie | null };
  /** @deprecated Use groupDestroy instead */
  movieDestroy: { args: { input: MovieDestroyInput }; result: boolean };
  /** @deprecated Use groupUpdate instead */
  movieUpdate: { args: { input: MovieUpdateInput }; result: Movie | null };
  /** @deprecated Use groupsDestroy instead */
  moviesDestroy: { args: { ids: string[] }; result: boolean };
  /** Optimises the database. Returns the job ID */
  optimiseDatabase: { args: Record<string, never>; result: string };
  performerCreate: { args: { input: PerformerCreateInput }; result: Performer | null };
  performerDestroy: { args: { input: PerformerDestroyInput }; result: boolean };
  performerMerge: { args: { input: PerformerMergeInput }; result: Performer };
  performerUpdate: { args: { input: PerformerUpdateInput }; result: Performer | null };
  performersDestroy: { args: { ids: string[] }; result: boolean };
  /** DANGEROUS: Execute an arbitrary SQL statement that returns rows. */
  querySQL: { args: { args?: (JsonValue | null)[] | null; sql: string }; result: SQLQueryResult };
  reloadPlugins: { args: Record<string, never>; result: boolean };
  /** Reload scrapers */
  reloadScrapers: { args: Record<string, never>; result: boolean };
  removeGalleryImages: { args: { input: GalleryRemoveInput }; result: boolean };
  removeGroupSubGroups: { args: { input: GroupSubGroupRemoveInput }; result: boolean };
  /** Removes an IP address from the temporary DLNA whitelist */
  removeTempDLNAIP: { args: { input: RemoveTempDLNAIPInput }; result: boolean };
  /** Reorder sub groups within a group. Returns true if successful. */
  reorderSubGroups: { args: { input: ReorderSubGroupsInput }; result: boolean };
  resetGalleryCover: { args: { input: GalleryResetCoverInput }; result: boolean };
  /** Reveal the file in the system file manager */
  revealFileInFileManager: { args: { id: string }; result: boolean };
  /** Reveal the folder in the system file manager */
  revealFolderInFileManager: { args: { id: string }; result: boolean };
  /**
   * Runs a plugin operation. The operation is run immediately and does not use the job queue.
   * Returns a map of the result.
   */
  runPluginOperation: { args: { args?: Record<string, JsonValue> | null; plugin_id: string }; result: JsonValue | null };
  /**
   * Run a plugin task.
   * If task_name is provided, then the task must exist in the plugin config and the tasks configuration
   * will be used to run the plugin.
   * If no task_name is provided, then the plugin will be executed with the arguments provided only.
   * Returns the job ID
   */
  runPluginTask: { args: { args?: PluginArgInput[] | null; args_map?: Record<string, JsonValue> | null; description?: string | null; plugin_id: string; task_name?: string | null }; result: string };
  saveFilter: { args: { input: SaveFilterInput }; result: SavedFilter };
  /** Increments the o-counter for a scene. Uses the current time if none provided. */
  sceneAddO: { args: { id: string; times?: string[] | null }; result: HistoryMutationResult };
  /** Increments the play count for the scene. Uses the current time if none provided. */
  sceneAddPlay: { args: { id: string; times?: string[] | null }; result: HistoryMutationResult };
  sceneAssignFile: { args: { input: AssignSceneFileInput }; result: boolean };
  sceneCreate: { args: { input: SceneCreateInput }; result: Scene | null };
  /**
   * Decrements the o-counter for a scene. Returns the new value
   *
   * @deprecated Use sceneRemoveO instead
   */
  sceneDecrementO: { args: { id: string }; result: number };
  /** Decrements the o-counter for a scene, removing the last recorded time if specific time not provided. Returns the new value */
  sceneDeleteO: { args: { id: string; times?: string[] | null }; result: HistoryMutationResult };
  /** Decrements the play count for the scene, removing the specific times or the last recorded time if not provided. */
  sceneDeletePlay: { args: { id: string; times?: string[] | null }; result: HistoryMutationResult };
  sceneDestroy: { args: { input: SceneDestroyInput }; result: boolean };
  /** Generates screenshot at specified time in seconds. Leave empty to generate default screenshot */
  sceneGenerateScreenshot: { args: { at?: number | null; id: string }; result: string };
  /**
   * Increments the o-counter for a scene. Returns the new value
   *
   * @deprecated Use sceneAddO instead
   */
  sceneIncrementO: { args: { id: string }; result: number };
  /**
   * Increments the play count for the scene. Returns the new play count value.
   *
   * @deprecated Use sceneAddPlay instead
   */
  sceneIncrementPlayCount: { args: { id: string }; result: number };
  sceneMarkerCreate: { args: { input: SceneMarkerCreateInput }; result: SceneMarker | null };
  sceneMarkerDestroy: { args: { id: string }; result: boolean };
  sceneMarkerUpdate: { args: { input: SceneMarkerUpdateInput }; result: SceneMarker | null };
  sceneMarkersDestroy: { args: { ids: string[] }; result: boolean };
  sceneMerge: { args: { input: SceneMergeInput }; result: Scene | null };
  /** Resets the resume time point and play duration */
  sceneResetActivity: { args: { id: string; reset_duration?: boolean | null; reset_resume?: boolean | null }; result: boolean };
  /** Resets the o-counter for a scene to 0. Returns the new value */
  sceneResetO: { args: { id: string }; result: number };
  /** Resets the play count for a scene to 0. Returns the new play count value. */
  sceneResetPlayCount: { args: { id: string }; result: number };
  /** Sets the resume time point (if provided) and adds the provided duration to the scene's play duration */
  sceneSaveActivity: { args: { id: string; playDuration?: number | null; resume_time?: number | null }; result: boolean };
  sceneUpdate: { args: { input: SceneUpdateInput }; result: Scene | null };
  scenesDestroy: { args: { input: ScenesDestroyInput }; result: boolean };
  scenesUpdate: { args: { input: SceneUpdateInput[] }; result: (Scene | null)[] | null };
  /** @deprecated now uses UI config */
  setDefaultFilter: { args: { input: SetDefaultFilterInput }; result: boolean };
  setGalleryCover: { args: { input: GallerySetCoverInput }; result: boolean };
  /**
   * Enable/disable plugins - enabledMap is a map of plugin IDs to enabled booleans.
   * Plugins not in the map are not affected.
   */
  setPluginsEnabled: { args: { enabledMap: Record<string, boolean> }; result: boolean };
  setup: { args: { input: SetupInput }; result: boolean };
  /** Run batch performer tag task. Returns the job ID. */
  stashBoxBatchPerformerTag: { args: { input: StashBoxBatchTagInput }; result: string };
  /** Run batch studio tag task. Returns the job ID. */
  stashBoxBatchStudioTag: { args: { input: StashBoxBatchTagInput }; result: string };
  /** Run batch tag tag task. Returns the job ID. */
  stashBoxBatchTagTag: { args: { input: StashBoxBatchTagInput }; result: string };
  stopAllJobs: { args: Record<string, never>; result: boolean };
  stopJob: { args: { job_id: string }; result: boolean };
  studioCreate: { args: { input: StudioCreateInput }; result: Studio | null };
  studioDestroy: { args: { input: StudioDestroyInput }; result: boolean };
  studioUpdate: { args: { input: StudioUpdateInput }; result: Studio | null };
  studiosDestroy: { args: { ids: string[] }; result: boolean };
  /** Submit fingerprints to stash-box instance */
  submitStashBoxFingerprints: { args: { input: StashBoxFingerprintSubmissionInput }; result: boolean };
  /** Submit performer as draft to stash-box instance */
  submitStashBoxPerformerDraft: { args: { input: StashBoxDraftSubmissionInput }; result: string | null };
  /** Submit scene as draft to stash-box instance */
  submitStashBoxSceneDraft: { args: { input: StashBoxDraftSubmissionInput }; result: string | null };
  tagCreate: { args: { input: TagCreateInput }; result: Tag | null };
  tagDestroy: { args: { input: TagDestroyInput }; result: boolean };
  tagUpdate: { args: { input: TagUpdateInput }; result: Tag | null };
  tagsDestroy: { args: { ids: string[] }; result: boolean };
  tagsMerge: { args: { input: TagsMergeInput }; result: Tag | null };
  /**
   * Uninstalls the given packages.
   * If an error occurs when uninstalling a package, the job will continue to uninstall the remaining packages.
   * Returns the job ID
   */
  uninstallPackages: { args: { packages: PackageSpecInput[]; type: PackageType }; result: string };
  /**
   * Updates the given packages.
   * If a package is not installed, it will not be installed.
   * If a package does not need to be updated, it will not be updated.
   * If no packages are provided, all packages of the given type will be updated.
   * If an error occurs when updating a package, the job will continue to update the remaining packages.
   * Returns the job ID.
   */
  updatePackages: { args: { packages?: PackageSpecInput[] | null; type: PackageType }; result: string };
};

export type Subscriptions = {
  /** Update from the metadata manager */
  jobsSubscribe: { args: Record<string, never>; result: JobStatusUpdate };
  loggingSubscribe: { args: Record<string, never>; result: LogEntry[] };
  scanCompleteSubscribe: { args: Record<string, never>; result: boolean };
};
