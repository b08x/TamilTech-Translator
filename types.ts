
export type InputType = 'text' | 'url' | 'file';

export interface PipelineState {
  originalText: string;
  preliminaryTranslation: string;
  fluencyReview: string;
  accuracyReview: string;
  styleReview: string;
  synthesizedText: string;
  finalPolish: string;
}

export interface LoadingStates {
  translation: boolean;
  review: boolean;
  synthesis: boolean;
  polish: boolean;
}

export interface CompletionStates {
    step1: boolean;
    step2: boolean;
    step3: boolean;
    step4: boolean;
    step5: boolean;
}
