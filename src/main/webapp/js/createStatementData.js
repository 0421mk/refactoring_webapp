export default function createStatementData(invoice, plays) {
	// 중간 데이터 구조 역할을 할 객체 생성
	const result = {};
	// 고객 데이터와 공연 데이터를 중간 데이터로 옮김
	result.customer = invoice.customer;

	// {first}.map.({second})) => first 객체에 second 작업(또는 추가)를 거친 Json 객체값을 리턴
	result.performances = invoice.performances.map(enrichPerformance);
	result.totalAmount = totalAmount(result);
	result.totalVolumeCredits = totalVolumeCredits(result);

	return result;

	// {} 객체로 aPerformance 값을 겹치치 않는 요소를 살리면서 덮어쓰기
	// 즉 복사한다는 뜻, result는 복사된 값 출력
	// 복사를 한 이유는 함수로 건넨 데이터 인수를 수정하기 싫어서이다
	function enrichPerformance(aPerformance) {
		const result = Object.assign({}, aPerformance);
		result.play = playFor(result);
		result.amount = amountFor(result);
		result.volumeCredits = volumeCreditsFor(result);
		return result;
	}

	function playFor(aPerformance) {
		return plays[aPerformance.playID];
	}

	// 매개변수의 역할이 뚜렷하지 않을 때 부정관사(a/an)을 붙인다.
	function amountFor(aPerformance) {
		let result = 0;

		switch (aPerformance.play.type) {
			case "tragedy":
				result = 40000;
				if (aPerformance.audience > 30) {
					result += 1000 * (aPerformance.audience - 30);
				}
				break;
			case "comedy":
				result = 30000;
				if (aPerformance.audience > 20) {
					result += 10000 + 500 * (aPerformance.audience - 20);
				}
				result += 300 * aPerformance.audience;
				break;
			default:
				throw new Error('알 수 없는 장르 : ${play.type}');
		}
		return result;
	}

	function volumeCreditsFor(aPerformance) {
		let result = 0;
		result += Math.max(aPerformance.audience - 30, 0);
		// 희극 관객 5명마다 추가 포인트 제공
		if ("comedy" === aPerformance.play.type)
			result += Math.floor(aPerformance.audience / 5);
		return result;
	}

	function totalVolumeCredits(data) {
		return data.performances
			.reduce((total, p) => total + p.volumeCredits, 0);
	}

	// 함수 결과값 변수는 result로 통일한다.
	function totalAmount(data) {
		return data.performances
			.reduce((total, p) => total + p.amount, 0);
	}
}