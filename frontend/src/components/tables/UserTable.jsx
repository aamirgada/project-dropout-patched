import { useState } from 'react';
import { Edit, Trash2, UserCheck } from 'lucide-react';

const UserTable = ({ users, mentors, onUpdate, onDelete, onAssignMentor }) => {
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleEditClick = (user) => {
    setEditingUser(user._id);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      isActive: user.isActive
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (userId) => {
    await onUpdate(userId, editForm);
    setEditingUser(null);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditForm({});
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'mentor':
        return 'bg-blue-100 text-blue-800';
      case 'student':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!users || users.length === 0) {
    return (
      <div className="card text-center py-8 text-gray-500">
        No users found
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned Mentor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                {editingUser === user._id ? (
                  <>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                        className="input text-sm"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="email"
                        name="email"
                        value={editForm.email}
                        onChange={handleEditChange}
                        className="input text-sm"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="tel"
                        name="phone"
                        value={editForm.phone}
                        onChange={handleEditChange}
                        className="input text-sm"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <select
                        name="role"
                        value={editForm.role}
                        onChange={handleEditChange}
                        className="input text-sm"
                      >
                        <option value="student">Student</option>
                        <option value="mentor">Mentor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        name="isActive"
                        value={editForm.isActive}
                        onChange={(e) => setEditForm({ ...editForm, isActive: e.target.value === 'true' })}
                        className="input text-sm"
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      {user.role === 'student' && (
                        <AssignMentorDropdown
                          studentId={user._id}
                          currentMentorId={user.assignedMentor?._id}
                          mentors={mentors}
                          onAssign={onAssignMentor}
                        />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditSubmit(user._id)}
                          className="text-green-600 hover:text-green-900 text-sm font-medium"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.phone || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge ${
                        user.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.role === 'student' ? (
                        user.assignedMentor ? (
                          <div className="text-sm text-gray-900">{user.assignedMentor.name}</div>
                        ) : (
                          <AssignMentorDropdown
                            studentId={user._id}
                            currentMentorId={null}
                            mentors={mentors}
                            onAssign={onAssignMentor}
                          />
                        )
                      ) : (
                        <span className="text-sm text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditClick(user)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => onDelete(user._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Deactivate"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Assign Mentor Dropdown Component
const AssignMentorDropdown = ({ studentId, currentMentorId, mentors, onAssign }) => {
  const [selectedMentorId, setSelectedMentorId] = useState(currentMentorId || '');

  const handleAssign = () => {
    if (selectedMentorId) {
      onAssign(studentId, selectedMentorId);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <select
        value={selectedMentorId}
        onChange={(e) => setSelectedMentorId(e.target.value)}
        className="input text-sm"
      >
        <option value="">Select Mentor</option>
        {mentors.map((mentor) => (
          <option key={mentor._id} value={mentor._id}>
            {mentor.name}
          </option>
        ))}
      </select>
      <button
        onClick={handleAssign}
        disabled={!selectedMentorId}
        className="text-green-600 hover:text-green-900 disabled:opacity-50"
        title="Assign Mentor"
      >
        <UserCheck className="h-5 w-5" />
      </button>
    </div>
  );
};

export default UserTable;