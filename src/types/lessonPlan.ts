export interface VocabularyItem {
  englishTerm: string;
  indonesianTerm: string;
  definition: string;
  exampleContext: string;
}

export interface LessonMeeting5E {
  meetingNumber: number;
  focusTitle: string;
  engage: {
    time: string;
    activity: string;
  };
  explore: {
    time: string;
    activity: string;
  };
  explain: {
    time: string;
    activity: string;
  };
  elaborate: {
    time: string;
    activity: string;
  };
  evaluate: {
    time: string;
    activity: string;
  };
}

export interface IGCSELessonPlan {
  id?: string;
  createdAt?: string;
  header: {
    school: string;
    subjectCode: string;
    topic: string;
    subtopics: string;
    yearGroup: string;
    duration: string;
    numberOfMeetings: number;
    teacher: string;
    principal: string;
  };
  learningObjectives: {
    cambridgeAOs: string[];
    walt: string;
    wilf: string[];
    slo: string[];
    clilLanguageObjectives: {
      keyLanguageFocus: string;
      vocabularyList: VocabularyItem[];
    };
  };
  differentiationProvisions: {
    struggledScaffolding: string[];
    ealSupport: string[];
    senScaffolding: string[];
    extensionTasks: string[];
  };
  lessonSequence: LessonMeeting5E[];
  postLesson: {
    formativeAssessment: string[];
    homeworkOrNextLesson: string[];
    teacherReflectionPrompts: string[];
    resourceList: string[];
  };
  approval: {
    teacherName: string;
    hodName: string;
    principalName: string;
  };
}

export interface LessonPlanFormData {
  topic: string;
  subtopics: string;
  objective: string;
  teachingMethod: string;
  duration: string;
  meetingsCount: number;
}
