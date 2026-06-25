"use client";

import { useEffect, useState } from "react";
import type { Trip } from "@/lib/types";

export default function TripPage({ params }: { params: { id: string } }) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [tab, setTab] = useState("Overview");

  useEffect(() => {
    async function loadTrip() {
      const trips = JSON.parse(localStorage.getItem("packsy_trips") || "[]");
      const localTrip = trips.find((t: Trip) => t.id === params.id);

      if (localTrip) {
        setTrip(localTrip);
        return;
      }

      const { supabase } = await import("@/lib/supabaseClient");
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        setTrip(null);
        return;
      }

      const { data } = await supabase
        .from("trips")
        .select("trip_data")
        .eq("user_id", userData.user.id);

      const cloudTrip = data
        ?.map((row: any) => row.trip_data)
        .find((t: Trip) => t.id === params.id);

      setTrip(cloudTrip || null);
    }

    loadTrip();
  }, [params.id]);

  function toggle(catId: string, itemId: string) {
    if (!trip) return;

    const updated = {
      ...trip,
      categories: trip.categories.map((category) =>
        category.id === catId
          ? {
              ...category,
              items: category.items.map((item) =>
                item.id === itemId ? { ...item, packed: !item.packed } : item
              ),
            }
          : category
      ),
    };

    setTrip(updated);

    const trips = JSON.parse(localStorage.getItem("packsy_trips") || "[]");
    const nextTrips = trips.map((t: Trip) => (t.id === updated.id ? updated : t));

    localStorage.setItem("packsy_trips", JSON.stringify(nextTrips));
  }

  if (!trip) {
    return (
      <div className="phoneShell">
        <div className="phone">
          <div className="screen">Trip not found.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="phoneShell">
      <div className="phone">
        <div className="heroImage">
          <div>
            <h1 style={{ margin: 0 }}>{trip.destination}</h1>
            <p>
              {trip.startDate} – {trip.endDate}
            </p>
            <p>
              {trip.travelers.length} travelers • {trip.tripType} • {trip.luggage}
            </p>
          </div>
        </div>

        <div className="screen">
          <div className="chips">
            {["Overview", "List", "Details"].map((item) => (
              <button
                key={item}
                className={`chip ${tab === item ? "active" : ""}`}
                onClick={() => setTab(item)}
              >
                {item}
              </button>
            ))}
          </div>

          {tab === "Overview" && (
            <>
              <div className="card">
                <b>Weather in {trip.destination}</b>
                <p>AI weather-aware recommendations included.</p>
              </div>

              <h3>Your Packing List</h3>

              {trip.categories.map((category) => (
                <div className="listRow" key={category.id}>
                  <span>
                    {category.icon} {category.name}
                  </span>
                  <span>{category.items.length} items ›</span>
                </div>
              ))}
            </>
          )}

          {tab === "List" && (
            <>
              <h2>Packing List</h2>

              {trip.categories.map((category) => (
                <div className="card" key={category.id}>
                  <h3>
                    {category.icon} {category.name}
                  </h3>

                  {category.items.map((item) => (
                    <div className="checkRow" key={item.id}>
                      <input
                        type="checkbox"
                        checked={item.packed}
                        onChange={() => toggle(category.id, item.id)}
                      />
                      <span>{item.name}</span>
                      <span>{item.quantity}</span>
                      <span>›</span>
                    </div>
                  ))}
                </div>
              ))}
            </>
          )}

          {tab === "Details" && (
            <>
              <h2>Trip Details</h2>

              <div className="insight">
                <b>✨ AI Insights</b>
                <p>{trip.insights}</p>
                <button className="secondary">Regenerate Insights</button>
              </div>

              <div className="card">
                <p>📍 Destination: {trip.destination}</p>
                <p>
                  📅 Dates: {trip.startDate} – {trip.endDate}
                </p>
                <p>👥 Travelers: {trip.travelers.length}</p>
                <p>🏷️ Trip Type: {trip.tripType}</p>
                <p>🧳 Luggage: {trip.luggage}</p>
              </div>
            </>
          )}
        </div>

        <nav className="bottomNav">
          <div className="navItem active">
            🧳
            <br />
            Overview
          </div>
          <div className="navItem">
            ✅
            <br />
            List
          </div>
          <div className="navItem">
            📅
            <br />
            Calendar
          </div>
          <div className="navItem">
            📝
            <br />
            Notes
          </div>
          <div className="navItem">
            ⋯
            <br />
            More
          </div>
        </nav>
      </div>
    </div>
  );
}
