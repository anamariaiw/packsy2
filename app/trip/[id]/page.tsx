"use client";

import { useEffect, useState } from "react";
import type { Trip } from "@/lib/types";

export default function TripPage() {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [tab, setTab] = useState("Overview");

  useEffect(() => {
    async function loadTrip() {
      const tripId = window.location.pathname.split("/").pop();

      // Try localStorage first
      const trips: Trip[] = JSON.parse(
        localStorage.getItem("packsy_trips") || "[]"
      );

      const localTrip = trips.find((t) => t.id === tripId);

      if (localTrip) {
        setTrip(localTrip);
        return;
      }

      // Otherwise load from Supabase API
      const res = await fetch(`/api/trips/${tripId}`);

      if (!res.ok) {
        setTrip(null);
        return;
      }

      const data = await res.json();
      setTrip(data.trip);
    }

    loadTrip();
  }, []);

  function toggle(catId: string, itemId: string) {
    if (!trip) return;

    const updated = {
      ...trip,
      categories: trip.categories.map((c) =>
        c.id === catId
          ? {
              ...c,
              items: c.items.map((i) =>
                i.id === itemId
                  ? { ...i, packed: !i.packed }
                  : i
              ),
            }
          : c
      ),
    };

    setTrip(updated);

    const trips: Trip[] = JSON.parse(
      localStorage.getItem("packsy_trips") || "[]"
    );

    localStorage.setItem(
      "packsy_trips",
      JSON.stringify(
        trips.map((t) => (t.id === updated.id ? updated : t))
      )
    );
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
              {trip.travelers.length} travelers • {trip.tripType} •{" "}
              {trip.luggage}
            </p>
          </div>
        </div>

        <div className="screen">
          <div className="chips">
            {["Overview", "List", "Details"].map((x) => (
              <button
                key={x}
                className={`chip ${tab === x ? "active" : ""}`}
                onClick={() => setTab(x)}
              >
                {x}
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

              {trip.categories.map((c) => (
                <div className="listRow" key={c.id}>
                  <span>
                    {c.icon} {c.name}
                  </span>

                  <span>{c.items.length} items ›</span>
                </div>
              ))}
            </>
          )}

          {tab === "List" && (
            <>
              <h2>Packing List</h2>

              {trip.categories.map((c) => (
                <div className="card" key={c.id}>
                  <h3>
                    {c.icon} {c.name}
                  </h3>

                  {c.items.map((i) => (
                    <div className="checkRow" key={i.id}>
                      <input
                        type="checkbox"
                        checked={i.packed}
                        onChange={() => toggle(c.id, i.id)}
                      />

                      <span>{i.name}</span>

                      <span>{i.quantity}</span>

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

                <button className="secondary">
                  Regenerate Insights
                </button>
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
