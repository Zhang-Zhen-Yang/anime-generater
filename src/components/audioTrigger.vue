<template>
  <div class="audio-trigger bg-preset pointer" @click="toggleShowDialogAudio">
  </div>
</template>

<script>
export default {
  name: 'temp',
  data () {
    return {
      msg: 'temp'
    }
  },
  computed: {
    dialogAudio() {
      return this.$store.state.dialogAudio;
    }
  },
  methods: {
    toggleShowDialogAudio() {
      // alert('ddd');
      this.dialogAudio.show = !this.dialogAudio.show;
    }
  },
  created() {
    
  },
}
</script>

<style lang="scss">
  .audio-trigger{
    position: absolute;
    width: 40px;
    height: 40px;
    top: 10px;
    right:10px;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cpath d='M792.576 533.504l-572.8 52.608V183.424h572.8z' fill='%23FB677E'/%3E%3Cpath d='M506.112 883.712H219.776v-297.6l286.336-52.608z' fill='%23A16CF3'/%3E%3Cpath d='M792.576 883.712H506.112V533.504l286.464-39.04z' fill='%23479DF1'/%3E%3Cpath d='M759.936 63.104H263.168c-112.896 0-204.416 91.264-204.416 204.16v497.024c0 112.768 91.52 204.16 204.416 204.16h496.768c112.896 0 204.416-91.52 204.416-204.16V267.264c.128-112.896-91.392-204.16-204.416-204.16zM701.824 672.64h-.512c-2.56 32.896-25.984 61.696-59.904 68.48l-28.544 5.76c-24.32 4.864-45.952-2.048-60.16-16.896-10.88-11.648-17.408-27.52-17.408-46.464 0-15.104 6.016-30.336 15.872-42.496.512-.512 1.024-1.28 1.536-1.792 9.856-11.136 22.784-19.456 36.864-22.272l52.864-10.624c15.36-3.328 26.24-16.64 26.24-32.384V381.568c0-8.32-7.552-14.72-15.872-13.184L429.696 414.08C421.888 415.616 416 422.4 416 430.464v284.8h-.256c2.304 37.12-22.784 71.04-60.16 78.592l-33.152 6.784c-39.936 8.064-72.832-18.688-72.832-59.648V736c0-30.336 24.32-59.904 53.888-65.92l53.888-10.88c14.848-3.072 25.472-16.128 25.472-31.36V310.272c0-12.416 8.832-23.296 20.992-25.472l268.928-54.784c15.104-3.072 29.056 8.576 29.056 24.064v418.56z' fill='%23FFF'/%3E%3C/svg%3E");
  }
</style>
