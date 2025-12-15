import { Edit2, Eye, Trash2, Car, Calendar, Hash } from "lucide-react";
import { useState } from "react";

interface Vehicle {
  id: string | number;
  vehicle_number: string;
  chassis_number: string;
  make?: string;
  model?: string;
  year?: string | number;
  created_at: string;
}

interface CustomerVehiclesTableProps {
  data: Vehicle[];
  onView: (vehicleId: string | number) => void;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicleId: string | number) => void;
  dateFormatter: (date: string) => string;
}

const CustomerVehiclesTable = ({
  data = [],
  onView,
  onEdit,
  onDelete,
  dateFormatter,
}: CustomerVehiclesTableProps) => {
  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);
  const hasData = data && data.length > 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-full">
          {!hasData && (
            <caption className="py-8 text-center">
              <Car className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No vehicles added yet</p>
              <p className="text-gray-400 text-sm mt-1">Vehicle information will appear here</p>
            </caption>
          )}

          {hasData && (
            <>
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      Vehicle Number
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Chassis Number
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4" />
                      Vehicle Details
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Added On
                    </div>
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {data.map((vehicle) => (
                  <tr
                    key={vehicle.id}
                    className="border-b border-gray-100 hover:bg-blue-50/30 transition-all duration-150"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {/* <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center"> */}
                        {/* // <Car className="w-4 h-4 text-blue-600" /> */}
                        {/* </div> */}
                        <span className="font-semibold text-gray-900">
                          {vehicle.vehicle_number}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      {vehicle.chassis_number ? (
                        <span className="text-sm text-gray-700 font-mono">
                          {vehicle.chassis_number}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm italic">
                          No chassis provided
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        {vehicle.make || vehicle.model ? (
                          <>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-900">
                                {vehicle.make}
                              </span>
                              {vehicle.make && vehicle.model && (
                                <span className="text-gray-400">•</span>
                              )}
                              <span className="text-sm text-gray-600">{vehicle.model}</span>
                            </div>
                            {vehicle.year && (
                              <span className="text-xs text-gray-500">Year: {vehicle.year}</span>
                            )}
                          </>
                        ) : (
                          <span className="text-gray-400 text-sm italic">No details</span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-700">
                        {dateFormatter(vehicle.created_at)}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex justify-center gap-1.5">
                        <div className="relative">
                          <button
                            className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors text-gray-600"
                            onClick={() => onView(vehicle.id)}
                            onMouseEnter={() => setHoveredTooltip(`view-${vehicle.id}`)}
                            onMouseLeave={() => setHoveredTooltip(null)}
                            aria-label="View vehicle details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {hoveredTooltip === `view-${vehicle.id}` && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-10 shadow-lg">
                              View details
                              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                            </div>
                          )}
                        </div>

                        <div className="relative">
                          <button
                            className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-amber-50 hover:text-amber-600 transition-colors text-gray-600"
                            onClick={() => onEdit(vehicle)}
                            onMouseEnter={() => setHoveredTooltip(`edit-${vehicle.id}`)}
                            onMouseLeave={() => setHoveredTooltip(null)}
                            aria-label="Edit vehicle"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          {hoveredTooltip === `edit-${vehicle.id}` && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-10 shadow-lg">
                              Edit vehicle
                              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                            </div>
                          )}
                        </div>

                        <div className="relative">
                          <button
                            className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-red-50 hover:text-red-600 transition-colors text-gray-600"
                            onClick={() => onDelete(vehicle.id)}
                            onMouseEnter={() => setHoveredTooltip(`delete-${vehicle.id}`)}
                            onMouseLeave={() => setHoveredTooltip(null)}
                            aria-label="Delete vehicle"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          {hoveredTooltip === `delete-${vehicle.id}` && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-10 shadow-lg">
                              Delete vehicle
                              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-3 text-center text-sm text-gray-600 bg-gray-50 border-t border-gray-200"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Car className="w-4 h-4" />
                      <span>Total vehicles: {data.length}</span>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </>
          )}
        </table>
      </div>
    </div>
  );
};

export default CustomerVehiclesTable;
