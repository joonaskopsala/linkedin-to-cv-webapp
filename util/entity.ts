type ContactFields = Record<string, string>;

type Profile = {
  name?: string;
  headline?: string;
  city?: string;
  summary?: string;
  photoUrl?: string | null;
  contact?: ContactFields;
  skills?: string[];
};

export type { Profile };
