import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import { PageHeader } from "@/components/PageHeader";
import { BottomNav } from "@/components/BottomNav";
import { ReportCard } from "@/components/ReportCard";
import { useGetEventAnalytics } from "@/hooks/api/useAnalytics";
import { useGetDaysByEvent } from "@/hooks/api/useEvents";
import { useEventStore } from "@/stores/eventStore";

const barColors = ["#3B82F6", "#22C55E", "#F97316", "#EC4899"];
const pieColors = ["#3B82F6", "#22C55E", "#F97316", "#EC4899", "#A855F7", "#6B7280"];

export default function Report() {
  const { currentEvent } = useEventStore();
  const [selectedDay, setSelectedDay] = useState<number | null>(null); // null = "All"

  // Get all days for the event
  const { data: days = [] } = useGetDaysByEvent(currentEvent?.id || null);

  // Get analytics - fetch different data based on selected day
  const { data: analytics, isLoading } = useGetEventAnalytics(
    currentEvent?.id || null,
    selectedDay || undefined
  );

  // Build day filters dynamically from actual days
  const dayFilters = useMemo(() => {
    const filters: Array<{ label: string; value: number | null }> = [{ label: "All", value: null }];
    days.forEach((day) => {
      filters.push({ label: `Day ${day.dayNumber}`, value: day.dayNumber });
    });
    return filters;
  }, [days]);

  // Get day-specific data from analytics
  const getDayData = (dayNumber: number | null) => {
    if (!analytics) return null;
    
    if (dayNumber === null) {
      // All days - use overall analytics
      return {
        total: analytics.totalAttendance,
        byDay: analytics.byDay,
        byService: analytics.byService,
        byGender: analytics.byGender,
        byAgeRange: analytics.byAgeRange,
      };
    } else {
      // Specific day - extract from byDay object
      const dayKey = `day${dayNumber}`;
      const dayTotal = analytics.byDay[dayKey] || 0;
      
      return {
        total: dayTotal,
        byDay: { [dayKey]: dayTotal },
        byService: analytics.byService.filter((s) => s.service.includes(`Day ${dayNumber}`)),
        byGender: analytics.byGender, // Gender breakdown might be same or filtered
        byAgeRange: analytics.byAgeRange, // Age breakdown might be same or filtered
      };
    }
  };

  const dayData = getDayData(selectedDay);

  // Prepare chart data
  const serviceData = useMemo(() => {
    if (!dayData) return [];
    return dayData.byService.map((service) => ({
      name: service.service,
      value: service.count,
    }));
  }, [dayData]);

  const ageRangeData = useMemo(() => {
    if (!dayData) return [];
    return dayData.byAgeRange.map((item) => ({
      name: item.range,
      value: item.count,
      percentage: item.percentage,
    }));
  }, [dayData]);

  // Get day breakdown for cards
  const dayBreakdown = useMemo(() => {
    if (!analytics) return {};
    return analytics.byDay;
  }, [analytics]);

  if (!currentEvent) {
    return (
      <div className="min-h-screen bg-background pb-24 flex items-center justify-center">
        <p className="text-muted-foreground">No event selected</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics || !dayData) {
    return (
      <div className="min-h-screen bg-background pb-24 flex items-center justify-center">
        <p className="text-muted-foreground">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="Report" />

      <div className="px-4 py-4 max-w-lg mx-auto">
        {/* Day Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {dayFilters.map((filter) => (
            <button
              key={filter.label}
              onClick={() => setSelectedDay(filter.value)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedDay === filter.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-foreground border border-border hover:bg-muted"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Attendance List */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Attendance List</h2>
          <div className="bg-card rounded-xl p-5 shadow-sm mb-4">
            <p className="text-muted-foreground mb-1">
              Total Attendance {selectedDay ? `- Day ${selectedDay}` : "(All Days)"}
            </p>
            <p className="text-4xl font-bold text-foreground">{dayData.total}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ReportCard
              label="All Days"
              value={dayBreakdown.allDays || 0}
              variant="blue"
            />
            {days.map((day, index) => {
              const dayKey = `day${day.dayNumber}`;
              const dayValue = dayBreakdown[dayKey] || 0;
              const variants: Array<"blue" | "green" | "yellow" | "pink"> = [
                "green",
                "yellow",
                "pink",
              ];
              return (
                <ReportCard
                  key={day.id}
                  label={`Day ${day.dayNumber}`}
                  value={dayValue}
                  variant={variants[index % variants.length] || "blue"}
                />
              );
            })}
          </div>
        </section>

        {/* Attendance by Gender */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Attendance by Gender</h2>
          <div className="grid grid-cols-2 gap-4">
            <ReportCard
              label="Male"
              value={dayData.byGender.male.count}
              variant="blue"
              showPercentage
              percentage={dayData.byGender.male.percentage}
            />
            <ReportCard
              label="Female"
              value={dayData.byGender.female.count}
              variant="pink"
              showPercentage
              percentage={dayData.byGender.female.percentage}
            />
          </div>
        </section>

        {/* Attendance by Service (Bar Chart) */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Attendance by Service</h2>
          <div className="bg-card rounded-xl p-4 shadow-sm">
            {serviceData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={serviceData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {serviceData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center">
                <p className="text-muted-foreground">No service data available</p>
              </div>
            )}
          </div>
        </section>

        {/* Attendance by Age Range (Pie Chart) */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Attendance by Age Range</h2>
          <div className="bg-card rounded-xl p-4 shadow-sm">
            {ageRangeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={ageRangeData}
                    cx="35%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ percentage }) => `${percentage}%`}
                    labelLine={false}
                  >
                    {ageRangeData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    formatter={(value) => {
                      const data = ageRangeData.find((d) => d.name === value);
                      return (
                        <span className="text-sm text-foreground">
                          {value} - {data?.value}
                        </span>
                      );
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">No age range data available</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  );
}
