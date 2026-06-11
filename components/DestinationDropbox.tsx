"use client";

import { useEffect, useRef, useState } from "react";

type Destination = {
    id: string;
    name: string;
};

export default function DestinationDropbox({ value, onSelect }: any) {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [list, setList] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_WEBSITE_URL}api/Admin/Destination`
                );

                const data = await response.json();

                setDestinations(data.data || []);
                setList(data.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;

        onSelect(value);

        const filtered = destinations.filter((item) =>
            item.name.toLowerCase().includes(value.toLowerCase())
        );

        setList(filtered);
        setOpen(true);
    }

    function handleSelect(item: Destination) {
        onSelect(item.name);
        setOpen(false);
    }

    return (
        <div ref={dropdownRef} className="relative w-fit">
            <input
                type="text"
                value={value}
                onChange={(e) => {
                    onSelect(e.target.value);
                    handleChange(e);
                }}
                onFocus={() => setOpen(true)}
                placeholder="Search destination..."
                className="w-full border rounded px-3 py-2"
            />

            {open && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded shadow-lg max-h-60 overflow-y-auto z-50">
                    {loading ? (
                        <div className="p-3">Loading...</div>
                    ) : list.length > 0 ? (
                        list.map((item) => (
                            <div
                                key={item.id}
                                onMouseDown={() => handleSelect(item)}
                                className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                            >
                                {item.name}
                            </div>
                        ))
                    ) : (
                        <div className="p-3 text-gray-500">
                            No destinations found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}