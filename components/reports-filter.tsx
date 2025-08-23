"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Filter, X } from "lucide-react"

interface ReportsFilterProps {
  onSearch: (query: string) => void
  onDateFilter: (range: { start?: Date; end?: Date }) => void
  onStatusFilter: (status: "all" | "completed" | "in-progress") => void
  totalCount: number
  filteredCount: number
}

export function ReportsFilter({
  onSearch,
  onDateFilter,
  onStatusFilter,
  totalCount,
  filteredCount,
}: ReportsFilterProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [dateRange, setDateRange] = useState({ start: "", end: "" })
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "in-progress">("all")
  const [showFilters, setShowFilters] = useState(false)

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    onSearch(value)
  }

  const handleDateRangeChange = (field: "start" | "end", value: string) => {
    const newRange = { ...dateRange, [field]: value }
    setDateRange(newRange)

    onDateFilter({
      start: newRange.start ? new Date(newRange.start) : undefined,
      end: newRange.end ? new Date(newRange.end) : undefined,
    })
  }

  const handleStatusChange = (value: "all" | "completed" | "in-progress") => {
    setStatusFilter(value)
    onStatusFilter(value)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setDateRange({ start: "", end: "" })
    setStatusFilter("all")
    onSearch("")
    onDateFilter({})
    onStatusFilter("all")
  }

  const hasActiveFilters = searchQuery || dateRange.start || dateRange.end || statusFilter !== "all"

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search by patient name, ID, or date..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
        {hasActiveFilters && (
          <Button variant="outline" onClick={clearFilters}>
            <X className="w-4 h-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => handleDateRangeChange("start", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <Input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => handleDateRangeChange("end", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tests</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {filteredCount === totalCount ? (
          <span>Showing all {totalCount} test results</span>
        ) : (
          <span>
            Showing {filteredCount} of {totalCount} test results
          </span>
        )}
      </div>
    </div>
  )
}
