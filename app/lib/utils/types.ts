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
      name: string;
    }[];
  }[];

  cabBookings: {
    id: string;
    CabOwner: {
      id: string;
      name: string;
      phone: string;
      bookedDates: {
        id: string;
        cabBookingId: string;
        cabOwnerId: string;
        date: string;
      }[];
    };
  }[];

  followUps: {
    id: string;
    date: string;
    message: string;
  }[];
}
export type ModalProps = {
  enquiryId: number | null;
  onClose: () => void;
};
