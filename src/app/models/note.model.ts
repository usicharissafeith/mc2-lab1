export interface Note {
  id: string;
  title: string;
  body: string;
  done: boolean;
  createdAt: Date | null;
}

// What the form sends when creating a note.
export type NewNote = Pick<Note, 'title' | 'body'>;