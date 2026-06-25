export type Traveler={id:string;name:string;selected:boolean};
export type PackingItem={id:string;name:string;quantity:number;packed:boolean};
export type PackingCategory={id:string;name:string;icon:string;items:PackingItem[]};
export type Trip={id:string;destination:string;startDate:string;endDate:string;travelers:Traveler[];tripType:string;tripTypeIcon:string;luggage:string;activities:string;notes:string;weatherRecommendation:boolean;categories:PackingCategory[];insights:string;createdAt:string};
