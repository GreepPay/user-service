export type MediaOutput = {
    url: string;
    type: string;
    size?: number;
  };
  
  export type Phone = {
    code: string;
    number: string;
  };
  
  export type Location = {
    type: 'Point';
    coordinates: [number, number];
    address: string;
    city: string;
    state: string;
    country: string;
  };
  
  export type Ratings = {
    total: number;
    count: number;
    average?: number;
  };
  
  export type Time = {
    hour: number;
    minute: number;
  };