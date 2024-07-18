export function Label(state) {
	let className = 'full-box'; // 默认类
	if (state === 'success') {
		className += ' success'; // 添加成功状态的类
	} else if (state === 'rejected') {
		className += ' rejected'; // 添加拒绝状态的类
	} else if (state === 'unvalidated') {
		className += ' unvalidated'; // 添加未验证状态的类
	}

	return <div className={className}>{state}</div>;
}
