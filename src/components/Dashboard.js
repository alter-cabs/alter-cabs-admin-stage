import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Users, Car, MapPin, Star, Calendar, CreditCard } from 'lucide-react';
import Papa from 'papaparse';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [data, setData] = useState({
    users: [],
    drivers: [],
    bookings: [],
    rides: [],
    vehicles: [],
    zones: [],
    ratings: []
  });
  const [loading, setLoading] = useState(true);

  // Load CSV data on mount
  useEffect(() => {
    loadCSVData();
  }, []);

  const loadCSVData = async () => {
    try {
      const csvFiles = [
        { file: 'UsersGrid view.csv', entity: 'users' },
        { file: 'DriversGrid view.csv', entity: 'drivers' },
        { file: 'BookingsGrid view.csv', entity: 'bookings' },
        { file: 'RidesGrid view.csv', entity: 'rides' },
        { file: 'VehiclesGrid view.csv', entity: 'vehicles' },
        { file: 'ZonesGrid view.csv', entity: 'zones' },
        { file: 'RatingsGrid view.csv', entity: 'ratings' }
      ];
      
      const loadedData = { ...data };
      
      for (const { file, entity } of csvFiles) {
        try {
          const content = await window.fs.readFile(file, { encoding: 'utf8' });
          const parsed = Papa.parse(content, { 
            header: true, 
            skipEmptyLines: true,
            dynamicTyping: true 
          });
          
          loadedData[entity] = parsed.data;
        } catch (err) {
          console.log(`Could not load ${file}:`, err);
          // Keep sample data for entities that fail to load
        }
      }
      
      setData(loadedData);
    } catch (error) {
      console.error('Error loading CSV data:', error);
      // Initialize with sample data if files not available
      setData({
        users: [
          { 'User ID': 1, Name: 'John Doe', Email: 'john@email.com', Phone: '+1234567890', Rating: '4.8', 'Total Coins': '150', 'Past Rides': '25', Gender: 'Male' },
          { 'User ID': 2, Name: 'Jane Smith', Email: 'jane@email.com', Phone: '+1234567891', Rating: '4.9', 'Total Coins': '200', 'Past Rides': '35', Gender: 'Female' }
        ],
        drivers: [
          { 'Driver ID': 1, Name: 'Mike Driver', Phone: '+1987654321', 'Online Status': 'Online', Ratings: '4.7', Email: 'mike@email.com', Gender: 'Male', 'Vehicle Type': 'Sedan' },
          { 'Driver ID': 2, Name: 'Sarah Wilson', Phone: '+1987654322', 'Online Status': 'Offline', Ratings: '4.8', Email: 'sarah@email.com', Gender: 'Female', 'Vehicle Type': 'SUV' }
        ],
        bookings: [
          { 'Booking ID': 1, Distance: '5.2 km', User: 'John Doe', Time: '2024-01-15 10:30', Pickup: '123 Main St', Drop: '456 Oak Ave', Status: 'Completed', Fare: '$15.50' },
          { 'Booking ID': 2, Distance: '3.8 km', User: 'Jane Smith', Time: '2024-01-15 11:00', Pickup: '789 Pine St', Drop: '321 Elm St', Status: 'In Progress', Fare: '$12.00' }
        ],
        rides: [
          { 'Ride ID': 1, 'Start Time': '2024-01-15 10:30', 'End Time': '2024-01-15 11:00', 'Driver ID': '1', Rating: '5', 'Actual Fare': '$15.50', 'Payment Mode': 'Card' },
          { 'Ride ID': 2, 'Start Time': '2024-01-15 11:00', 'End Time': '', 'Driver ID': '2', Rating: '', 'Actual Fare': '', 'Payment Mode': 'Cash' }
        ],
        vehicles: [
          { 'Vehicle ID': 1, 'Plate No': 'ABC123', 'Fare/KM': '$2.50', Type: 'Sedan', Driver: 'Mike Driver', 'City/Zone': 'Downtown', Capacity: '4' },
          { 'Vehicle ID': 2, 'Plate No': 'XYZ789', 'Fare/KM': '$3.00', Type: 'SUV', Driver: 'Sarah Wilson', 'City/Zone': 'Uptown', Capacity: '6' }
        ],
        zones: [
          { 'Zone Name': 'Downtown', 'Base Fare': '$5.00', 'Available Vehicles': '25', 'Per KM': '$2.50' },
          { 'Zone Name': 'Uptown', 'Base Fare': '$6.00', 'Available Vehicles': '18', 'Per KM': '$3.00' }
        ],
        ratings: [
          { 'User ID': '1', Driver: 'Mike Driver', FeedBack: 'Great service!', Ratings: '5', Ride: '1' },
          { 'User ID': '2', Driver: 'Sarah Wilson', FeedBack: 'Very professional', Ratings: '5', Ride: '2' }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'users', label: 'Users', icon: Users, count: data.users?.length || 0 },
    { id: 'drivers', label: 'Drivers', icon: Car, count: data.drivers?.length || 0 },
    { id: 'bookings', label: 'Bookings', icon: Calendar, count: data.bookings?.length || 0 },
    { id: 'rides', label: 'Rides', icon: MapPin, count: data.rides?.length || 0 },
    { id: 'vehicles', label: 'Vehicles', icon: Car, count: data.vehicles?.length || 0 },
    { id: 'zones', label: 'Zones', icon: MapPin, count: data.zones?.length || 0 },
    { id: 'ratings', label: 'Ratings', icon: Star, count: data.ratings?.length || 0 }
  ];

  const getCurrentData = () => data[activeTab] || [];
  
  const filteredData = getCurrentData().filter(item => 
    Object.values(item).some(value => 
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getColumns = (entityType) => {
    const item = getCurrentData()[0];
    if (!item) return [];
    
    return Object.keys(item).filter(key => key !== 'id');
  };

  const addItem = () => {
    setSelectedItem(null);
    setFormData({});
    setShowModal(true);
  };

  const editItem = (item) => {
    setSelectedItem(item);
    setFormData(item);
    setShowModal(true);
  };

  const deleteItem = (index) => {
    const newData = { ...data };
    newData[activeTab].splice(index, 1);
    setData(newData);
  };

  const saveItem = (itemData) => {
    const newData = { ...data };
    if (selectedItem) {
      // Edit existing
      const index = newData[activeTab].findIndex(item => 
        item === selectedItem
      );
      newData[activeTab][index] = itemData;
    } else {
      // Add new
      const idField = getIdField(activeTab);
      const newId = Math.max(...newData[activeTab].map(item => parseInt(item[idField]) || 0), 0) + 1;
      newData[activeTab].push({
        ...itemData,
        [idField]: newId
      });
    }
    setData(newData);
    setShowModal(false);
    setFormData({});
  };

  const getIdField = (entity) => {
    const idFields = {
      users: 'User ID',
      drivers: 'Driver ID',
      bookings: 'Booking ID',
      rides: 'Ride ID',
      vehicles: 'Vehicle ID',
      zones: 'Zone Name',
      ratings: 'User ID'
    };
    return idFields[entity] || 'id';
  };

  const renderTable = () => {
    const columns = getColumns(activeTab);
    
    if (loading) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-500">Loading data...</div>
        </div>
      );
    }
    
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(column => (
                <th key={column} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  {column}
                </th>
              ))}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {columns.map(column => (
                  <td key={column} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item[column] || '-'}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => editItem(item)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => deleteItem(index)}
                    className="text-red-600 hover:text-red-900"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderModal = () => {
    if (!showModal) return null;
    
    const columns = getColumns(activeTab);
    
    const handleSubmit = () => {
      saveItem(formData);
    };
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-96 overflow-y-auto">
          <h3 className="text-lg font-medium mb-4">
            {selectedItem ? 'Edit' : 'Add'} {activeTab.slice(0, -1)}
          </h3>
          
          <div>
            {columns.map(column => (
              <div key={column} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {column}
                </label>
                <input
                  type="text"
                  value={formData[column] || ''}
                  onChange={(e) => setFormData({...formData, [column]: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
            
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Alter Cabs Admin</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={addItem}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Add {activeTab.slice(0, -1)}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon size={20} />
                  <span>{tab.label}</span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow">
          {getCurrentData().length > 0 ? (
            renderTable()
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">No {activeTab} found</div>
              <button
                onClick={addItem}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Add First {activeTab.slice(0, -1)}
              </button>
            </div>
          )}
        </div>
      </div>

      {renderModal()}
    </div>
  );
};

export default Dashboard;