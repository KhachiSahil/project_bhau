import { useState } from "react";

interface FollowUpItem {
  id: string;
  date: string;
  message: string;
}

interface FollowUpProps {
  FollowUpsData: FollowUpItem[];
  handleFollowUps: (date: string, note: string) => void;
  isEditing: boolean;
}

export default function FollowUp({
  FollowUpsData,
  handleFollowUps,
  isEditing,
}: FollowUpProps) {
  const [selectedDate, setSelectedDate] = useState("");
  const [followUpNote, setFollowUpNote] = useState("");

  const handleScheduleFollowUp = () => {
    if (selectedDate && followUpNote.trim()) {
      handleFollowUps(selectedDate, followUpNote);
      setSelectedDate("");
      setFollowUpNote("");
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow-md border border-gray-300">
      <h2 className="text-xl font-bold mb-4">📅 Follow-Ups</h2>

      {/* Add Follow-Up Only if Editing */}
      {isEditing && (
        <div className="p-4 rounded-md border border-gray-400">
          <h3 className="text-lg font-semibold text-gray-800">Set a New Follow-Up</h3>
          <input
            type="date"
            className="w-full p-2 border rounded-md mt-2 text-gray-600"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <textarea
            className="w-full p-2 border rounded-md mt-2 text-gray-600"
            placeholder="Add a follow-up note..."
            value={followUpNote}
            onChange={(e) => setFollowUpNote(e.target.value)}
          />
          <button
            className="mt-2 font-bold bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500"
            onClick={handleScheduleFollowUp}
          >
            Schedule Follow-Up
          </button>
        </div>
      )}

      {/* Show Previous Follow-Ups */}
      <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-300 overflow-y-auto h-32 md:h-full">
        {FollowUpsData?.length > 0 ? (
          <ul className="space-y-2">
            {FollowUpsData.map((followUp, index) => (
              <li key={index} className="p-2 bg-white border rounded shadow-sm">
                <strong className="text-blue-600">Date:</strong>{" "}
                {followUp.date.split("T")[0]} <br />
                <span className="text-gray-700">{followUp.message}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No follow-ups scheduled.</p>
        )}
      </div>
    </div>
  );
}
