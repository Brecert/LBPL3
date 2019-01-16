if (module.hot) {
	module.hot.dispose(() => {
		window.location.reload();
	})
}
