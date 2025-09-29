export type NoteTag = "Work" | "Personal" | "Meeting" | "Shopping" | "Todo";

export interface Note {
    id: number;
    title: string;
    content: string;
    createdAt: string; 
    updatedAt: string;
    tag: NoteTag;
  }

  export interface CreateNoteParams {
    title: string;
    content: string;
    tag: NoteTag;
  }