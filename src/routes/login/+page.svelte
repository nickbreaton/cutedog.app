<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();
</script>

<form method="POST" action="?/login" use:enhance>
	<label>
		<span>Password</span>
		<input type="password" name="password" />
	</label>
	<button>Login</button>
	<p>{form?.error}</p>
</form>
