//types for Employee/Enquiries
export interface dataModalProps {
  id: string;
  pickupDate: string;
  dropDate: string;
  adults: number;
  kids: number;
  requirements: string;
  status: string;
  createdAt: string;
  quotation: string[];
  employeeId: string;
  websiteId: string;

  Customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };

  destination: {
    id: string;
    name: string;
  };

  pickupLocation: {
    id: string;
    name: string;
  };

  dropLocation: {
    id: string;
    name: string;
  };

  website: {
    id: string;
    name: string;
  };

  hotels: {
    id: string;
    name: string;
    bookingDates: {
      id: string;
      date: string;
      name: string;  // UI-only field for hotel name on a date, not in DB
    }[];
  }[];

  cabBookings: {
    id: string;
    pickupDate?: string;   // optional — falls back to enquiry dates in API
    dropDate?: string;
    CabOwner: {
      id: string;
      name: string;
      phone: string;
      // no bookedDates here anymore
    };
    bookedDates: {         // moved here from CabOwner
      id: string;
      cabBookingId: string;
      date: string;
      // no cabOwnerId — removed from schema
    }[];
  }[];

  followUps: {
    id: string;
    date: string;
    message: string;
    enquiryId?: string;    // used to detect new (temp) vs existing follow-ups
  }[];
}
export type ModalProps = {
  enquiryId: number | null;
  onClose: () => void;
};
