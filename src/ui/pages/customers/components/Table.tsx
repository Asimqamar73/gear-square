import { Edit, Eye, Trash2, Building2, Mail, Phone, MapPin, User } from "lucide-react";
import { useState } from "react";

interface Customer {
  id: string | number;
  name: string;
  phone_number: string;
  email?: string;
  company_name?: string;
  company_phone_number?: string;
  address?: string;
}

interface CustomerTableProps {
  data: Customer[];
  onView: (id: string | number) => void;
  onEdit: (id: string | number) => void;
  onDelete: (id: string | number) => void;
}

const CustomerTable = ({ data, onView, onEdit, onDelete }: CustomerTableProps) => {
  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);
  const hasData = data.length > 0;

  const renderCellValue = (value: string | undefined, icon?: React.ReactNode) => {
    if (!value) {
      return <span className="text-gray-400 text-sm italic">Not provided</span>;
    }
    return (
      <div className="flex items-center gap-2">
        {icon && <span className="text-gray-500">{icon}</span>}
        <span className="text-sm">{value}</span>
      </div>
    );
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          {!hasData && (
            <caption className="py-8 text-center">
              <Building2 className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No customers found</p>
              <p className="text-gray-400 text-sm mt-1">Start by adding your first customer</p>
            </caption>
          )}

          {hasData && (
            <>
              {/* <thead>
                <tr className="bg-gray-200 border-b border-gray-200">
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 tracking-wider">
                    CUSTOMER INFO
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 tracking-wider">
                    CONTACT
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 tracking-wider">
                    COMPANY INFO
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 tracking-wider">
                    LOCATION
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-gray-700 tracking-wider">
                    ACTIONS
                  </th>
                </tr>
              </thead> */}

              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-200 border-b border-gray-200">
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Customer info
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Contact
                    </div>
                  </th>

                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Company
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Location
                    </div>
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {data.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{customer.name}</span>
                        {customer.email && (
                          <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <Mail className="w-3 h-3" />
                            {customer.email}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">{renderCellValue(customer.phone_number)}</td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {customer.company_name ? (
                          <>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{customer.company_name}</span>
                            </div>
                            {customer.company_phone_number && (
                              <span className="text-xs text-gray-500">
                                {renderCellValue(
                                  customer.company_phone_number,
                                  <Phone className="w-3 h-3" />
                                )}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-gray-400 text-sm italic">No company</span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">{renderCellValue(customer.address)}</td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-1.5">
                        <div className="relative">
                          <button
                            className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors text-gray-600"
                            onClick={() => onView(customer.id)}
                            onMouseEnter={() => setHoveredTooltip(`view-${customer.id}`)}
                            onMouseLeave={() => setHoveredTooltip(null)}
                            aria-label="View customer details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {hoveredTooltip === `view-${customer.id}` && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-10">
                              View details
                            </div>
                          )}
                        </div>

                        <div className="relative">
                          <button
                            className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-amber-50 hover:text-amber-600 transition-colors text-gray-600"
                            onClick={() => onEdit(customer.id)}
                            onMouseEnter={() => setHoveredTooltip(`edit-${customer.id}`)}
                            onMouseLeave={() => setHoveredTooltip(null)}
                            aria-label="Edit customer"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          {hoveredTooltip === `edit-${customer.id}` && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-10">
                              Edit customer
                            </div>
                          )}
                        </div>

                        <div className="relative">
                          <button
                            className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-red-50 hover:text-red-600 transition-colors text-gray-600"
                            onClick={() => onDelete(customer.id)}
                            onMouseEnter={() => setHoveredTooltip(`delete-${customer.id}`)}
                            onMouseLeave={() => setHoveredTooltip(null)}
                            aria-label="Delete customer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          {hoveredTooltip === `delete-${customer.id}` && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-10">
                              Delete customer
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
                    className="px-6 py-4 text-center text-sm text-gray-600 bg-gray-50"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Building2 className="w-4 h-4" />
                      <span>
                        Showing {data.length} customer{data.length !== 1 ? "s" : ""}
                      </span>
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

export default CustomerTable;
