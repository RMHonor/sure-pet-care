export interface State {
  pets: Pet[];
}

export interface Pet {
  breed_id: number;
  comments: string;
  created_at: string;
  date_of_birth: string;
  gender: Gender;
  household_id: number;
  id: number;
  name: string;
  photo: Photo;
  photo_id: number;
  position: Position;
  species_id: number;
  status: {
    activity: Position;
  };
  tag_id: number
  updated_at: string;
  version: string;
  weight: string;
}

export enum Gender {
  Female,
  Male,
}

export interface Photo {
  created_at: string;
  id: number;
  location: string;
  updated_at: string;
  uploading_user_id: number;
  version: string;
}

export interface Position {
  tag_id: number;
  device_id: number;
  where: PetLocation;
  since: string;
}

export enum PetLocation {
  Unknown,
  Inside,
  Outside,
}
