<template>
  <div id="terminal-container"></div>
</template>

<script>
import { MessagePlugin } from 'tdesign-vue';
import { Terminal } from "xterm";
import "xterm/dist/xterm.css";
import * as fit from 'xterm/lib/addons/fit/fit';
Terminal.applyAddon(fit)

export default {
  mounted() {
    let ticket_value = this.$route.query.ticket_value
    if (ticket_value === undefined || ticket_value === null || ticket_value === "") {
      MessagePlugin.error("ticket not found")
      this.$router.push("/ui/project/list")
    }

    document.getElementById('terminal-container').style.height = window.innerHeight + 'px';
    document.getElementById('terminal-container').style.width = window.innerWidth + 'px';
    let terminalContainer = document.getElementById('terminal-container')
    let term = new Terminal({
		  "cursorBlink":true,
	  })
    term.open(terminalContainer)
    
    
    this.terminal = term
    this.terminal.write("connecting to pod...")
    this.terminal.fit();

    
    let _this = this
  

    // connect to web socket.
    let ws = new WebSocket('ws://localhost:9999/ws?ticket_value=' + ticket_value)
    ws.onopen = this.onopen
    ws.onmessage = this.onmessage
    ws.onclose = this.onclose
    ws.onerror = this.onerror

    this.ws = ws
		// term.toggleFullScreen(true);
		this.terminal.on('data', function (data) {
			let msg = {operation: "stdin", data: data}
			_this.ws.send(JSON.stringify(msg))
		});
		this.terminal.on('resize', function (size) {
			let msg = {operation: "resize", cols: size.cols, rows: size.rows}
			_this.ws.send(JSON.stringify(msg))
		});
  },
  data() {
    return {
      terminal: null,
      ws: null
    }
  },
  methods: {
    onopen() {
      this.terminal.write("\r");
			let msg = {operation: "stdin", data: "export TERM=xterm && clear \r"}
			this.ws.send(JSON.stringify(msg))
    },
    onmessage(event) {
			let msg = JSON.parse(event.data)
			if (msg.operation === "stdout") {
				this.terminal.write(msg.data)
			} else {
				console.log("invalid msg operation: "+msg)
			}
    },
    onclose(event) {
			if (event.wasClean) {
				console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
			} else {
				console.log('[close] Connection died');
				this.terminal.writeln("")
			}
			this.terminal.write('Connection Reset By Peer! Try Refresh.');
		},
		onerror(error) {
			console.log('[error] Connection error');
			this.terminal.write("error: "+error.message);
			this.terminal.destroy();
		}
  },
}
</script>

<style>
</style>