import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
//import { useGetPurchasedCoursesQuery } from "@/features/api/purchaseApi";
import React from "react";
//import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";



function Dashboard() {
  return (
     <div className=" grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
         <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Total Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-600"></p>
        </CardContent>
      </Card>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-600"></p>
        </CardContent>
      </Card>
     </div>
    
  );
}

export default Dashboard;
