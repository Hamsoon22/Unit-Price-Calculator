import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function UnitPriceCalculator() {
  const [fabricCost, setFabricCost] = useState('');
  const [makingCostPerUnit, setMakingCostPerUnit] = useState('');
  const [quantityOrdered, setQuantityOrdered] = useState('');
  const [expectedSales, setExpectedSales] = useState('');
  const [labelCost, setLabelCost] = useState('');
  const [marketingCost, setMarketingCost] = useState('');
  const [vatRate, setVatRate] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [isVatIncluded, setIsVatIncluded] = useState(true); // VAT 포함 여부

  const parsed = (v) => parseFloat(v) || 0;

  const effectiveQuantity = expectedSales ? parsed(expectedSales) : parsed(quantityOrdered);
  const makingCostTotal = parsed(makingCostPerUnit) * parsed(quantityOrdered);
  const totalCost = parsed(fabricCost) + parsed(labelCost) + makingCostTotal + parsed(marketingCost);
  const unitCost = parsed(quantityOrdered) > 0 ? totalCost / parsed(quantityOrdered) : 0;

  const vatRateValue = parsed(vatRate);
  const selling = parsed(sellingPrice);
  const vatAmount = isVatIncluded
    ? (selling * vatRateValue) / (100 + vatRateValue)
    : (selling * vatRateValue) / 100;
  const netSellingPrice = isVatIncluded ? selling - vatAmount : selling;
  const estimatedTotalRevenue = netSellingPrice * effectiveQuantity;
  const estimatedNetProfit = estimatedTotalRevenue - totalCost;
  const profitMargin = estimatedTotalRevenue > 0 ? (estimatedNetProfit / estimatedTotalRevenue) * 100 : 0;
  const unitsToBreakEven = netSellingPrice > 0 ? Math.ceil(totalCost / netSellingPrice) : 0;

  const pieData = [
    { name: "원가", value: totalCost },
    { name: "순이익", value: estimatedNetProfit > 0 ? estimatedNetProfit : 0 },
  ];

  const COLORS = ["#8884d8", "#82ca9d"];

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow space-y-6 text-sm">
      <h2 className="text-2xl font-semibold text-center">👕 패션 제품 단가 & 손익 계산기</h2>

      <div className="grid grid-cols-2 gap-4">
        <label>원단비
          <input type="number" value={fabricCost} onChange={(e) => setFabricCost(e.target.value)} className="w-full mt-1 border px-2 py-1 rounded" />
        </label>
        <label>제작비 (개당)
          <input type="number" value={makingCostPerUnit} onChange={(e) => setMakingCostPerUnit(e.target.value)} className="w-full mt-1 border px-2 py-1 rounded" />
        </label>
        <label>제작 수량
          <input type="number" value={quantityOrdered} onChange={(e) => setQuantityOrdered(e.target.value)} className="w-full mt-1 border px-2 py-1 rounded" />
        </label>
        <label>예상 판매 개수 (선택)
          <input type="number" value={expectedSales} onChange={(e) => setExpectedSales(e.target.value)} className="w-full mt-1 border px-2 py-1 rounded" />
        </label>
        <label>라벨/부자재 비용
          <input type="number" value={labelCost} onChange={(e) => setLabelCost(e.target.value)} className="w-full mt-1 border px-2 py-1 rounded" />
        </label>
        <label>마케팅 비용 (총)
          <input type="number" value={marketingCost} onChange={(e) => setMarketingCost(e.target.value)} className="w-full mt-1 border px-2 py-1 rounded" />
        </label>
        <label>판매가
          <input type="number" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} className="w-full mt-1 border px-2 py-1 rounded" />
        </label>
        <label>부가세율 (%)
          <input type="number" value={vatRate} onChange={(e) => setVatRate(e.target.value)} className="w-full mt-1 border px-2 py-1 rounded" />
        </label>
        <label className="col-span-2 flex items-center gap-2">
          <input type="checkbox" checked={isVatIncluded} onChange={(e) => setIsVatIncluded(e.target.checked)} />
          판매가에 부가세가 포함되어 있음
        </label>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg space-y-2">
      <p>💸 1개당 원가: <strong>{Math.round(unitCost).toLocaleString()}원</strong></p>
      <p>🧾 총 비용 (원가 합계): <strong>{Math.round(totalCost).toLocaleString()}원</strong></p> {/* ✅ 추가된 줄 */}
      <p>➕ 1개당 순수익 (판매가 - 원가, VAT 제외): <strong>{Math.round(netSellingPrice - unitCost).toLocaleString()}원</strong></p>
      <p>📦 손익분기점 판매 개수: <strong>{unitsToBreakEven}개</strong></p>
      <p>💰 예상 총 매출 (VAT 제외): <strong>{Math.round(estimatedTotalRevenue).toLocaleString()}원</strong></p>
      <p>📈 예상 순이익: <strong>{Math.round(estimatedNetProfit).toLocaleString()}원</strong></p>
      <p>📊 예상 마진율: <strong>{profitMargin.toFixed(1)}%</strong></p>
      </div>

      <div>
        <h3 className="text-sm font-medium text-center mb-2">손익 시각화</h3>
        <div className="h-64">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
