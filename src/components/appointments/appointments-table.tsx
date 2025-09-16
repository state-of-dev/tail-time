"use client"

import { DataTableNeobrutalism, createNeobrutalistColumns } from "@/components/ui/data-table-neobrutalism"
import * as ReactTable from "@tanstack/react-table"

type ColumnDef<TData, TValue = unknown> = ReactTable.ColumnDef<TData, TValue>
import { Calendar, Clock, DollarSign, User, Dog } from "lucide-react"

export interface Appointment {
  id: string
  customer_name: string
  pet_name: string
  pet_breed: string
  service_name: string
  appointment_date: string
  start_time: string
  end_time: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected'
  total_amount: number
  duration: number
  customer_phone?: string
  notes?: string
}

const statusMap = {
  'pending': { label: 'PENDIENTE', color: 'chart-3' },
  'confirmed': { label: 'CONFIRMADA', color: 'chart-4' },
  'completed': { label: 'COMPLETADA', color: 'chart-1' },
  'cancelled': { label: 'CANCELADA', color: 'chart-2' },
  'rejected': { label: 'RECHAZADA', color: 'chart-2' }
}

interface AppointmentsTableProps {
  appointments: Appointment[]
  onViewAppointment?: (appointment: Appointment) => void
  onEditAppointment?: (appointment: Appointment) => void
  onCancelAppointment?: (appointment: Appointment) => void
}

export function AppointmentsTable({
  appointments,
  onViewAppointment,
  onEditAppointment,
  onCancelAppointment
}: AppointmentsTableProps) {

  const columns: ColumnDef<Appointment>[] = [
    createNeobrutalistColumns.select(),

    // Date and Time
    {
      accessorKey: "appointment_date",
      header: "FECHA",
      cell: ({ row }) => {
        const date = new Date(row.getValue("appointment_date"))
        const startTime = row.original.start_time

        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-black text-main-foreground uppercase">
              <Calendar className="w-4 h-4" />
              {date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short'
              }).toUpperCase()}
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-main-foreground/80">
              <Clock className="w-3 h-3" />
              {startTime}
            </div>
          </div>
        )
      },
    },

    // Customer & Pet
    {
      accessorKey: "customer_name",
      header: "CLIENTE",
      cell: ({ row }) => {
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-black text-main-foreground uppercase">
              <User className="w-4 h-4" />
              {row.original.customer_name.toUpperCase()}
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-main-foreground/80 uppercase">
              <Dog className="w-3 h-3" />
              {row.original.pet_name.toUpperCase()} ({row.original.pet_breed.toUpperCase()})
            </div>
          </div>
        )
      },
    },

    // Service
    createNeobrutalistColumns.text("service_name", "SERVICIO"),

    // Status
    createNeobrutalistColumns.status("status", "ESTADO", statusMap),

    // Amount
    {
      accessorKey: "total_amount",
      header: "PRECIO",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("total_amount"))
        const formatted = new Intl.NumberFormat("es-MX", {
          style: "currency",
          currency: "MXN",
        }).format(amount)

        return (
          <div className="flex items-center gap-2 font-black text-main-foreground">
            <DollarSign className="w-4 h-4" />
            {formatted}
          </div>
        )
      },
    },

    // Actions
    createNeobrutalistColumns.actions(onEditAppointment, onCancelAppointment, onViewAppointment),
  ]

  return (
    <div className="w-full">
      <DataTableNeobrutalism
        columns={columns}
        data={appointments}
        searchKey="customer_name"
        searchPlaceholder="BUSCAR CLIENTE..."
      />
    </div>
  )
}