/* eslint-disable @typescript-eslint/no-unused-vars */
// Global domain types derived from the Supabase schema. These stay in the
// global type space (no exports) so that existing files that referenced them
// without explicit imports continue to type-check.

type Priority = {
    id: string;
    name: string;
    value: number;
};

type Status = {
    id: string;
    name: string;
    value: number;
};

type RequestType = {
    id: string;
    name: string;
};

type Equipment = {
    id: string;
    name: string;
    quantity: number;
    available: number;
};

type Song = {
    id: string;
    name: string;
    instrumental: boolean;
    lyrics: boolean;
};

type Venue = {
    id: string;
    name: string;
    available: boolean;
};

type Attachment = {
    id: string;
    request_id: string;
    name: string;
    type: string;
    size: number;
    url: string;
    created: string;
};

type Note = {
    id: string;
    author: string;
    request: string;
    note: string;
    created: string;
};

// JOIN TABLES

type RequestEquipment = {
    request_id: string;
    equipment_id: string;
    quantity: number;
    approved: boolean;
    equipment: Equipment;
};

type RequestSong = {
    request_id: string;
    song_id: string;
    song: Song;
};

type RequestVenue = {
    request_id: string;
    venue_id: string;
    approved: boolean;
    venue: Venue;
};

// Request

type BaseRequest = {
    who: string;
    what: string;
    when: string;
    where: string;
    why: string;
    how: string;
    info: string | null;
    due: string | null;
    flow: string[];
    priority: string;
    status: string;
    type: string;
}

type FormRequest = {
    who: string;
    what: string;
    when: string;
    where: string;
    why: string;
    how: string;
    info: string | null;
    due: string | null;
    flow: string[];
    priority: string;
    status: string;
    type: string;
    equipment: { id: string; quantity: number }[];
    attachments: {
        id: string;
        request: string;
        name: string;
        type: string;
        size: number;
        storage: string;
        created: string;
    }[];
    songs: { id: string }[];
};

type FetchRequest = {
    id: string;
    who: string;
    what: string;
    when: string;
    where: string;
    why: string;
    how: string;
    info: string | null;
    due: string | null;
    flow: string[];
    created_at: string;
    priority: Priority;
    status: Status;
    type: RequestType;
    attachment: Attachment[];
    note: Note[];
    equipment: RequestEquipment[];
    song: RequestSong[];
    venue: RequestVenue[];
};

// 

type  FormSteps = 1 | 2 | 3;