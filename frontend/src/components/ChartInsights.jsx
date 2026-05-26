import { chartItems } from "../utils/usage";
import { COLORS } from "../utils/usage";
import { formatINR } from "../hooks/currency";
import labels from "../labels/common";

function ChartInsights({ trips }) {
  const budgetData = trips.slice(0, 8).map((trip, index) => ({
    name:
      trip.destination?.length > 12
        ? trip.destination.substring(0, 12) + "..."
        : trip.destination,
    budget: trip.estimatedCost || trip.budget || 0,
    fullName: trip.destination,
  }));

  const daysData = trips.slice(0, 8).map((trip, index) => ({
    name:
      trip.destination?.length > 12
        ? trip.destination.substring(0, 12) + "..."
        : trip.destination,
    days: trip.days,
    fullName: trip.destination,
  }));

  return (
    <div className="charts-row">
      <div className="chart-card">
        <h3>{labels.chartField.barChartTitle}</h3>
        <div className="chart-wrapper">
          <chartItems.ResponsiveContainer width="100%" height={280}>
            <chartItems.BarChart data={budgetData}>
              <chartItems.CartesianGrid
                strokeDasharray="3 3"
                stroke="#e0e0e0"
              />
              <chartItems.XAxis
                dataKey="name"
                tick={{ fontSize: 11 }}
                interval={0}
                angle={-15}
                textAnchor="end"
                height={60}
              />
              <chartItems.YAxis tick={{ fontSize: 11 }} />
              <chartItems.Tooltip
                formatter={(value) => formatINR(value)}
                labelFormatter={(label) => {
                  const trip = budgetData.find((t) => t.name === label);
                  return trip?.fullName || label;
                }}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #43a047",
                  borderRadius: "8px",
                }}
              />
              <chartItems.Legend />
              <chartItems.Bar
                dataKey="budget"
                fill="#43a047"
                name="Budget"
                radius={[8, 8, 0, 0]}
              />
            </chartItems.BarChart>
          </chartItems.ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart: Days per Trip */}
      <div className="chart-card">
        <h3>{labels.chartField.pieChartTitle}</h3>
        <div className="chart-wrapper">
          <chartItems.ResponsiveContainer width="100%" height={280}>
            <chartItems.PieChart>
              <chartItems.Pie
                data={daysData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={90}
                dataKey="days"
                nameKey="name"
              >
                {daysData.map((entry, index) => (
                  <chartItems.Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </chartItems.Pie>
              <chartItems.Tooltip
                formatter={(value, name, props) => {
                  return [`${value} days`, props.payload.fullName || name];
                }}
              />
              <chartItems.Legend />
            </chartItems.PieChart>
          </chartItems.ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default ChartInsights;
