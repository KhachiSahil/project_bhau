//  rules or footer of the itenrary
export const DEFAULT_NOTES = [
    "Kindly carry a valid photo id card along while you will be on tour.",
    "Kindly let us know if any query is there pertaining to the tour itinerary. We have offered you an almost very clear and transparent tour program.",
    "Kindly provide us your Pick up and Dropping Time",
    "We hope the above-mentioned sightseeing is in order as per your requirement.",
    "Rohtang Pass sightseeing as per Govt. & NGT Guidelines. If required payable extra on the spot on a current condition basis, Violation of any rules & regulations is subject to penalty.",
    "A.C services will be switched off on Himachal roads.",
    "A.C charge for a whole day in the hill area will be Rs 1,000/- per day for Tempo Traveller, Rs 700/- per day for Toyota Innova/SUV/MUV, Rs 500/- per day for Toyota Etios/Swift Dzire/Sedan.",
    "Cab operator service hours for local sightseeing from 09 am to 6 pm.",
    "From the safety point of view, you are requested to avoid late-night walks.",
    "You are requested to consider all sightseeing as per the time and travel schedule.",
    "Change/addition in itinerary/sightseeing may increase cost w.r.t distance.",
    "Kindly take Hotel within 7 km from the main city otherwise it may cost extra w.r.t. distance.",
];

// function to make the date human readable
export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "long" });
    const year = date.getFullYear();
    const getOrdinal = (n: number) => {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };
    return `${getOrdinal(day)} ${month} ${year}`;
};

// building the format to build days list
export const buildDays = (arrivalDate: string, totalDays: number, pickupPlace: string, destination: string, dropPlace: string) => {
    const startDate = new Date(arrivalDate);
    return Array.from({ length: totalDays }, (_, i) => {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        const formattedDate = formatDate(currentDate.toISOString());

        if (i === 0) {
            return {
                day: i + 1,
                date: formattedDate,
                title: `${pickupPlace} To ${destination} (150 KM, 5-6 HRS)`,
                description: `After arrival at ${pickupPlace} we will drive for ${destination}. Evening is free to Visit Market. Overnight stay at Hotel.`,
            };
        } else if (i === totalDays - 1) {
            return {
                day: i + 1,
                date: formattedDate,
                title: `${destination} – ${dropPlace} (150 Kms, 5-6 Hours)`,
                description: `Today morning after breakfast we will drive for ${dropPlace}. After reaching check-in the hotel at ${dropPlace}. End of memorable tour and services.`,
            };
        } else {
            return {
                day: i + 1,
                date: formattedDate,
                title: `${destination} Local Sightseeing`,
                description: `Today after breakfast we will take you to visit famous attractions in ${destination}. Visit local temples, markets, viewpoints, and cultural sites. Evening free to explore. Overnight stay at Hotel.`,
            };
        }
    });
};

// export to PDF function
type editableContentTypes = {
    adults: string,
    children: string,
    childrenAges: string,
    transportationCost: string,
    vehicle: string,
    contactPerson: string,
    contactNumber: string,
    greeting: string,
}
type itineraryDaysTypes = {
    day: number;
    date: string;
    title: string;
    description: string;
}
export const exportToPDF = (editableContent:editableContentTypes, itineraryDays:itineraryDaysTypes[], notes:string[]) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const html = `
      <html><head><title>Tour Itinerary</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 30px; color: #000; max-width: 800px; margin: 0 auto; line-height: 1.6; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
        .company-name { font-size: 24px; font-weight: bold; }
        .day-item { margin: 20px 0; padding: 15px; border-left: 4px solid #333; background: #f8f9fa; }
        .day-title { font-weight: bold; font-size: 15px; margin-bottom: 8px; }
        .transport-section { background: #f0f0f0; padding: 20px; margin: 20px 0; }
        .terms-section { border: 1px solid #ddd; padding: 20px; margin: 20px 0; }
        .term-item { display: flex; gap: 8px; margin: 10px 0; }
        .contact-section { background: #333; color: white; padding: 25px; text-align: center; margin-top: 20px; }
      </style></head>
      <body>
        <div class="header">
          <div class="company-name">Himachal Taxi Rental Service</div>
          <div>Tour Itinerary & Cost</div>
        </div>
        <div style="text-align:center;margin:20px 0;">
          <p><strong>${editableContent.greeting}</strong></p>
          <p><strong>Greetings from Himachal Taxi Rental Service……</strong></p>
          <p><strong>Please find the below Tour Itinerary & Cost:</strong></p>
        </div>
        <div style="font-size:18px;font-weight:bold;margin:20px 0 10px;">Itinerary:</div>
        ${itineraryDays.map((day) => `
          <div class="day-item">
            <div class="day-title">Day ${String(day.day).padStart(2, "0")}: ${day.date} ~ ${day.title}</div>
            <div>${day.description}</div>
          </div>
        `).join("")}
        <div class="transport-section">
          <div style="font-size:18px;font-weight:bold;margin-bottom:12px;">Transportation (${itineraryDays.length - 1} Days)</div>
          <p><strong>Total Pax:</strong> ${editableContent.adults} Adults ${editableContent.children} Child${editableContent.childrenAges}</p>
          <p><strong>Transportation Cost:</strong> Rs ${editableContent.transportationCost}/- (Inclusive All Taxes + All Sightseeing)</p>
          <p><strong>Vehicle:</strong> ${editableContent.vehicle}</p>
          <p style="font-style:italic;color:#666;margin-top:10px;">(Inclusive All Taxes, Driver Allowances, Driver Perk, Driver Messing charges, Parking, Fuel, Tolls, Inter State Taxes, No Other Hidden Charges.)</p>
        </div>
        <div class="terms-section">
          <div style="font-size:18px;font-weight:bold;margin-bottom:12px;">Also requesting you to:</div>
          ${notes.map((note, i) => `<div class="term-item"><span><strong>${i + 1}.</strong></span><span>${note}</span></div>`).join("")}
        </div>
        <div class="contact-section">
          <p><strong>We would be pleased to hear from you awaiting your immediate response</strong></p>
          <p style="margin-top:16px;">With Regards,</p>
          <p><strong>${editableContent.contactPerson}</strong></p>
          <p><strong>${editableContent.contactNumber}</strong></p>
        </div>
      </body></html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
};
