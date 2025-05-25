// Shared types for the Algebrakit Webservice API

export type InteractionType =
  | 'MULTISTEP'
  | 'MATH_TABLE'
  | 'FILL_IN_THE_BLANKS'
  | 'GEOMETRY'
  | 'STATISTICS'
  | 'NUMBER_LINE'
  | 'ARITHMETIC'
  | 'CHOICE';

export type ExerciseStatus =
  | 'FINISHED'
  | 'CORRECT'
  | 'ERROR'
  | 'VIRGIN'
  | 'SUBMITTED'
  | 'GIVEUP'
  | 'UNKNOWN';

export interface InteractionScoring {
  finished: boolean;
  marksTotal: number;
  marksEarned: number;
  penalties?: {
    marksPenalty?: number;
    hintsRequested?: number;
    mathErrors?: number;
    notationErrors?: number;
  };
}

export interface TagDescription {
  descr: Record<string, string>;
  stepType: 'STRATEGY' | 'ALGEBRA' | 'CALCULATE' | 'ROUND' | 'CONCEPT';
  errors?: Array<{
    id: string;
    type: Array<'misconception' | 'mistake'>;
    descr: Record<string, string>;
  }>;
}

export interface QuestionResult {
  id: string;
  scoring: InteractionScoring;
  interactions: Array<InteractionResult>;
}

export interface InteractionResult {
  id: string;
  type: InteractionType;
  status: ExerciseStatus;
  progress: number;
  scoring: InteractionScoring;
  tags: Array<FeedbackTag>;
  events: Array<InteractionEvent>;
}

export interface FeedbackTag {
  id: string;
  errors?: string[];
  weight: number;
  source: 'ERROR_FEEDBACK' | 'FINISHED_STEP' | 'HINT';
}

export interface InteractionEvent {
  timestamp: number;
  event: 'EVALUATE' | 'HINT' | 'GIVEUP' | 'SUBMIT';
  exerciseStatus?: ExerciseStatus;
  progress?: number;
  inputStatus?: ExerciseStatus;
  tags?: Array<FeedbackTag>;
  annotations?: Array<Annotation>;
}

export interface Annotation {
  type: 'INPUT_EXPRESSION' | 'ERROR_FEEDBACK' | 'SELECTED_OPTIONS' | 'INPUT_CONTENT';
  expr?: Array<RichContent>;
  main?: Array<RichContent>;
  sub?: Array<RichContent>;
}

export interface RichContent {
  content: string;
  mimeType: string;
  akit?: string;
}

export interface ElementInfo {
  id: string;
  type: 'INSTRUCTION' | 'QUESTION';
  items: Array<ElementItemInfo>;
}

export interface ElementItemInfo {
  itemType: 'TEXT' | 'INTERACTION';
  interactionType?: InteractionType;
  content?: string;
  solution?: string;
  derivation?: Array<DerivationPart>;
  result?: InteractionResultInfo;
}

export interface DerivationPart {
  hint?: string;
  expression?: string;
  result?: string;
  description?: string;
  derivation?: Array<DerivationPart>;
}

export interface InteractionResultInfo {
  status: ExerciseStatus;
  progress: number;
  scoring: InteractionScoring;
  tags: Array<FeedbackTag>;
  events: Array<EventResultInfo>;
}

export interface EventResultInfo {
  timestamp: number;
  event: 'EVALUATE' | 'HINT' | 'GIVEUP' | 'SUBMIT';
  tags?: Array<FeedbackTag>;
  annotations?: Array<InfoAnnotation>;
}

export interface InfoAnnotation {
  type: 'INPUT_EXPRESSION' | 'ERROR_FEEDBACK' | 'SELECTED_OPTIONS' | 'INPUT_CONTENT';
  expr?: string;
  main?: string;
  sub?: string;
}

export interface InteractionDescription {
  type: InteractionType;
  marks: number;
  scorable?: boolean;
}

export interface SessionData {
  success: boolean;
  msg?: string;
  sessionId: string;
  type: 'SINGLE' | 'COMPOUND';
  solution?: boolean;
  html: string;
  marksTotal: number;
  interactions: Record<string, InteractionDescription>;
}
