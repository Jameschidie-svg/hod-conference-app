import { useState } from "react";
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
import reportData from "@/data/reports.json";

const dayFilters = ["All", "Day 1", "Day 2", "Day 3"];

const barColors = ["#3B82F6", "#22C55E", "#F97316", "#EC4899"];

const pieColors = ["#3B82F6", "#22C55E", "#F97316", "#EC4899", "#A855F7", "#6B7280"];

export default function Report() {
  const [selectedDay, setSelectedDay] = useState("All");

  const getFilteredData = () => {
    switch (selectedDay) {
      case "Day 1":
        return {
          total: reportData.attendanceByDay.day1,
          byService: [{ name: "Day 1", value: reportData.attendanceByDay.day1 }],
        };
      case "Day 2":
        return {
          total: reportData.attendanceByDay.day2,
          byService: [{ name: "Day 2", value: reportData.attendanceByDay.day2 }],
        };
      case "Day 3":
        return {
          total: reportData.attendanceByDay.day3,
          byService: [{ name: "Day 3", value: reportData.attendanceByDay.day3 }],
        };
      default:
        return {
          total: reportData.totalAttendance,
          byService: [
            { name: "All Days", value: reportData.attendanceByService.allDays },
            { name: "Day 1", value: reportData.attendanceByService.day1 },
            { name: "Day 2", value: reportData.attendanceByService.day2 },
            { name: "Day 3", value: reportData.attendanceByService.day3 },
          ],
        };
    }
  };

  const filteredData = getFilteredData();

  const ageRangeData = reportData.attendanceByAgeRange.map((item) => ({
    name: item.range,
    value: item.count,
    percentage: item.percentage,
  }));

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="Report" />

      <div className="px-4 py-4 max-w-lg mx-auto">
        {/* Day Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {dayFilters.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedDay === day
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-foreground border border-border hover:bg-muted"
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Attendance List */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Attendance List</h2>
          <div className="bg-card rounded-xl p-5 shadow-sm mb-4">
            <p className="text-muted-foreground mb-1">Total Attendance</p>
            <p className="text-4xl font-bold text-foreground">{filteredData.total}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ReportCard label="All Days" value={reportData.attendanceByDay.all} variant="blue" />
            <ReportCard label="Day 1" value={reportData.attendanceByDay.day1} variant="green" />
            <ReportCard label="Day 2" value={reportData.attendanceByDay.day2} variant="yellow" />
            <ReportCard label="Day 3" value={reportData.attendanceByDay.day3} variant="pink" />
          </div>
        </section>

        {/* Attendance by Gender */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Attendance by Gender</h2>
          <div className="grid grid-cols-2 gap-4">
            <ReportCard
              label="Male"
              value={reportData.attendanceByGender.male}
              variant="blue"
              showPercentage
              percentage={50}
            />
            <ReportCard
              label="Female"
              value={reportData.attendanceByGender.female}
              variant="pink"
              showPercentage
              percentage={50}
            />
          </div>
        </section>

        {/* Attendance by Service (Bar Chart) */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Attendance by Service</h2>
          <div className="bg-card rounded-xl p-4 shadow-sm">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={filteredData.byService} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
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
                  {filteredData.byService.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Attendance by Age Range (Pie Chart) */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Attendance by Age Range</h2>
          <div className="bg-card rounded-xl p-4 shadow-sm">
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
                  formatter={(value, entry: any) => {
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
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  );
}
