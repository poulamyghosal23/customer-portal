import { Dayjs } from 'dayjs';
import { Space } from './space';

export interface Venue {
    id?: number;
    name: string;
    alias: string;
    tzId: string;
    tzOffset: number;
    countryCode: string;
    accessHoursFrom: string | Dayjs | Date | undefined;
    accessHoursTo: string | Dayjs | Date | undefined;
    description: string;
    coordinates: {
        type: string;
        coordinates: number[];
    };
    city: string;
    state: string;
    country: string;
    currency: string;
    phone?: number;
    showOnMap: boolean;
    accessOpen: boolean;
    address: string;
    address2: string;
    accessCustom: boolean;
    status: string;
    email?: string;
    brandId: number;
    createdById: number;
    updatedById?: number;
    specialInstructions?: string;
    uploadAttachments?: string[];
    imageUrls?: string[];
    venueTypeId: number;
    venueType?: any;
    createdBy?: any;
    updatedBy?: any;
    venueAdmins? : [];
    accessCustomData?: [];
    brand?: any;
    logo?: any;
    photos?: [];
    space?: Space[];
}