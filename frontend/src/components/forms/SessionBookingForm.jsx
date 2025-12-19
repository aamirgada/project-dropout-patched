import { useState } from "react";
import { Calendar, Clock, MessageSquare, Video } from "lucide-react";

const SessionBookingForm = ({
  mentorId,
  mentorName,
  onSubmit,
  onCancel,
  loading,
}) => {
  const [formData, setFormData] = useState({
    scheduledDate: "",
    duration: 60,
    topic: "",
    notes: "",
    meetingLink: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
    };
    if (mentorId) {
      submitData.mentorId = mentorId;
    }
    onSubmit(submitData);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div
      className="
        bg-white/95 
        backdrop-blur-xl 
        rounded-2xl 
        shadow-2xl 
        border border-gray-300 
        p-8 
        relative 
        z-50
      "
    >
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <p className="text-xs font-semibold uppercase text-blue-600 tracking-wide">
          Session Booking
        </p>
        <h3 className="text-2xl font-bold text-gray-900">
          {mentorName ? `Book with ${mentorName}` : "Book a Session"}
        </h3>
        <p className="text-sm text-gray-500">
          Set the date, duration, and topic before confirming.
        </p>
      </div>

      {mentorName && (
        <div className="px-4 py-2 mb-6 bg-blue-100 text-blue-800 text-sm font-semibold rounded-lg border border-blue-200">
          Assigned Mentor: {mentorName}
        </div>
      )}

      {!mentorName && (
        <div className="px-4 py-2 mb-6 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-lg border border-yellow-200">
          No mentor assigned - You can still book a session
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date + Right Column */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              <Calendar className="inline h-4 w-4 mr-1" />
              Session Date & Time *
            </label>
            <input
              type="datetime-local"
              name="scheduledDate"
              value={formData.scheduledDate}
              onChange={handleChange}
              min={today}
              required
              className="
                w-full 
                border border-gray-300 
                rounded-lg 
                px-3 py-2 
                bg-gray-50 
                focus:bg-white
                focus:ring-2 
                focus:ring-blue-500 
                focus:outline-none
              "
            />
            <p className="text-xs text-gray-500 mt-1">
              Choose an available slot.
            </p>
          </div>

          {/* Duration + Meeting Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Duration */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                <Clock className="inline h-4 w-4 mr-1" />
                Duration *
              </label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                className="
                  w-full 
                  border border-gray-300 
                  rounded-lg 
                  px-3 py-2 
                  bg-gray-50 
                  focus:bg-white
                  focus:ring-2 
                  focus:ring-blue-500 
                  focus:outline-none
                "
              >
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
              </select>
            </div>

            {/* Meeting Link */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                <Video className="inline h-4 w-4 mr-1" />
                Meeting Link (optional)
              </label>
              <input
                type="url"
                name="meetingLink"
                value={formData.meetingLink}
                onChange={handleChange}
                placeholder="https://zoom.us/j/..."
                className="
                  w-full 
                  border border-gray-300 
                  rounded-lg 
                  px-3 py-2 
                  bg-gray-50 
                  focus:bg-white
                  focus:ring-2 
                  focus:ring-blue-500 
                  focus:outline-none
                "
              />
              <p className="text-xs text-gray-500 mt-1">
                Add Zoom/Meet link if available.
              </p>
            </div>
          </div>
        </div>

        {/* Topic */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            <MessageSquare className="inline h-4 w-4 mr-1" />
            Session Topic *
          </label>
          <input
            type="text"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            required
            placeholder="e.g., Study planning, Career guidance"
            className="
              w-full 
              border border-gray-300 
              rounded-lg 
              px-3 py-2 
              bg-gray-50 
              focus:bg-white
              focus:ring-2 
              focus:ring-blue-500 
              focus:outline-none
            "
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Additional Notes
          </label>
          <textarea
            name="notes"
            rows="4"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Agenda, preparation, or anything the student should bring."
            className="
              w-full 
              border border-gray-300 
              rounded-lg 
              px-3 py-2 
              bg-gray-50 
              focus:bg-white
              focus:ring-2 
              focus:ring-blue-500 
              focus:outline-none
            "
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row justify-end gap-4 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="
              w-full md:w-auto 
              px-5 py-2 
              border border-gray-300 
              text-gray-700 
              rounded-lg 
              hover:bg-gray-100 
              transition 
              disabled:opacity-50
            "
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full md:w-auto 
              px-5 py-2 
              bg-blue-600 
              text-white 
              rounded-lg 
              hover:bg-blue-700 
              transition 
              disabled:opacity-50
            "
          >
            {loading ? "Booking..." : "Book Session"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SessionBookingForm;
