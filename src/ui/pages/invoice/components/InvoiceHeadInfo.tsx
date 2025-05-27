import React from 'react'

const InvoiceHeadInfo = () => {
  return (
      <div className="p-4 bg-white rounded-2xl flex flex-col gap-4 border  border-gray-400 shadow">
            <h2 className="text-xl mt-2">General information</h2>
            <div className="flex gap-4">
              <div className="flex flex-col gap-1 grow">
                <label htmlFor="name" className="text-sm text-gray-500">
                  Owner name
                </label>
                <input
                  type="text"
                  name=""
                  id="name"
                  className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
                  //   onChange={onMutate}
                  //   value={product.name}
                  required
                  placeholder='e.g: John Doe'
                />
              </div>{" "}
              <div className="flex flex-col gap-1 grow">
                <label htmlFor="name" className="text-sm text-gray-500">
                  Phone number
                </label>
                <input
                  type="text"
                  name="phone-number"
                  id="phone-number"
                  className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
                  //   onChange={onMutate}
                  //   value={product.name}
                  required
                  placeholder='+97150564590811'
                />
              </div>
              <div className="flex flex-col gap-1 grow">
                <label htmlFor="name" className="text-sm text-gray-500">
                  Vehicle number
                </label>
                <input
                  type="text"
                  name="vehicle-number"
                  id="vehicle-number"
                  className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
                  //   onChange={onMutate}
                  //   value={product.name}
                  required
                  placeholder='LXI-990'
                />
              </div>
            </div>
          </div>
  )
}

export default InvoiceHeadInfo