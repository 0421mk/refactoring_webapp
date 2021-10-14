import createStatementData from "./createStatementData.js";

// json 데이터
var plays = {
	"hamlet": { "name": "Hamlet", "type": "tragedy" },
	"as-Like": { "name": "As You Like It", "type": "comedy" },
	"othello": { "name": "Othello", "type": "tragedy" }
};
// json 데이터
var invoices = {
	"customer": "BigCo",
	"performances": [
		{
			"playID": "hamlet",
			"audience": 55
		},
		{
			"playID": "as-Like",
			"audience": 35
		},
		{
			"playID": "othello",
			"audience": 40
		}
	]
};

// 다양한 연극을 외주로 받아서 공연하는 극단
// 공연 요청이 들어오면 연극의 장르와 관객 규모를 기초로 비용 책정
// 공연료와 별개로 포인트를 지급해서 다음번 의뢰 시 공연료 할인 가능

function htmlStatement(invoice, plays) {
	return renderHtml(createStatementData(invoice, plays));
}

function renderHtml(data) {
	console.log(data);
	let result = `<h1>청구 내역 (고객명: ${data.customer})</h1>\n`;
	result += "<table>\n";
	result += "<tr><th>연극</th><th>좌석 수</th><th>금액</th></tr>";
	for (let perf of data.performances) {
		result += `<tr><td>${perf.play.name}</td>
		<td>${perf.audience}석</td>
		<td>${usd(perf.amount)}</td></tr>\n`;
	}
	result += "</table>\n";
	result += `<p>총액: <em>${usd(data.totalAmount)}</em></p>\n`;
	result += `<p>적립 포인트: <em>${data.totalVolumeCredits}</em>점</p>\n`;

	return result;
}

// 공연료 청구서를 출력하는 코드
function statement(invoice, plays) {

	// 본문 전체를 별도 함수로 추출
	// 위 데이터로 인해 invoice 인수는 이제 필요가 없다
	return renderPlainText(createStatementData(invoice, plays));

}

// 중간 데이터 구조 역할 객체를 통해 계산 관련 코드는 statement() 함수로 모으고 
// renderPlainText()는 data 매개변수로 전달된 데이터만 처리하게 만들 수 있다
function renderPlainText(data) {
	let result = `청구 내역 (고객명: ${data.customer})\n`;

	for (let perf of data.performances) {
		// 청구 내역 출력
		result += `${perf.play.name}: ${usd(perf.amount)} (${perf.audience}석)\n`;
	}

	result += `총액: ${usd(data.totalAmount)}\n`;
	result += `적립 포인트: ${data.totalVolumeCredits}점\n`;
	return result;

}

// format => usd 메서드로 따로 생성하고 단위 변환 로직(/100)도 이동
function usd(aNumber) {
	return new Intl.NumberFormat("en-US", {
		style: "currency", currency: "USD",
		minimumFractionDigits: 2
	}).format(aNumber / 100);
}

// 테스트 코드
console.log(statement(invoices, plays));
document.body.innerHTML += htmlStatement(invoices, plays);