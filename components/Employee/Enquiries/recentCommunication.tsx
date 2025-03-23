import { useState } from "react";

type RecentCommunicationProps = {
    onClose: () => void;
};

export default function RecentCommunication({ onClose }: RecentCommunicationProps) {
    const [notes, setNotes] = useState<string[]>([]);
    const [newNote, setNewNote] = useState("");

    const handleAddNote = () => {
        if (newNote.trim()) {
            setNotes([newNote, ...notes]); // Add new note at the top
            setNewNote("");
        }
    };

    return (
        <div
            className="fixed w-screen inset-0 bg-black/50 z-50 flex items-center justify-center"
            onClick={onClose} // Click outside to close
        >
            <div className="bg-white p-6 rounded shadow-lg w-1/3" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-bold mb-4">Recent Communication</h2>

                {/* Notes & Communication */}
                <div className="bg-white p-4 rounded-sm shadow border border-gray-400">
                    <h3 className="text-2xl font-bold text-gray-800">Notes & Communication</h3>
                    <textarea
                        className="w-full p-2 border rounded-md mt-2 text-gray-600"
                        placeholder="Add a note..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                    />
                    <button
                        className="mt-2 font-bold bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                        onClick={handleAddNote}
                    >
                        Add Note
                    </button>
                </div>

                {/* Recent Communications */}
                <div className="mt-4 p-4 bg-gray-100 rounded-md border border-gray-300">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Recent Notes</h3>
                    {notes.length > 0 ? (
                        <ul className="space-y-2">
                            {notes.map((note, index) => (
                                <li key={index} className="p-2 bg-white border rounded shadow-sm">
                                    {note}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No recent notes added.</p>
                    )}
                </div>

                <button onClick={onClose} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">Close</button>
            </div>
        </div>
    );
}
