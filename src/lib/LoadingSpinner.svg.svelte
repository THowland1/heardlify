<script lang="ts">
  export let color: string = 'currentColor';
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  style="position: relative; left: 1px"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill={color}
  stroke={color}
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg
>

<style>
  svg {
    animation: spin 1s infinite linear;
    -moz-animation: spin 1s infinite linear;
    -webkit-animation: spin 1s infinite linear;
  }
  @-webkit-keyframes spin {
    from {
      transform: rotate(0turn);
    }
    to {
      transform: rotate(1turn);
    }
  }
  @-moz-keyframes spin {
    from {
      transform: rotate(0turn);
    }
    to {
      transform: rotate(1turn);
    }
  }
  @keyframes spin {
    from {
      transform: rotate(0turn);
    }
    to {
      transform: rotate(1turn);
    }
  }
</style>
