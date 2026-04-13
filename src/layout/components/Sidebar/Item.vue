<script>
  import router from '../../../router'
export default {
  name: "MenuItem",
  functional: true,
  props: {
    icon: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    isCurrent: {
      type: Boolean,
      default: false
    }
  },
  render(h, context) {
    const { icon, title, isCurrent } = context.props;
    const vnodes = [];

    if (icon) {
      if(['pdf','png','jpg'].includes(icon.replace(/.+\./,"").toLocaleLowerCase())){
        vnodes.push(<img class="icon-img" src={icon} />);
      }else {
        vnodes.push(<svg-icon icon-class={icon}/>)
      }
      // vnodes.push(<svg-icon icon-class={icon}/>)
    }
    if (title) {
      vnodes.push(<span class={isCurrent ? 'hightColor' : ''}>{title}</span>);
    }
    return vnodes;
  }
};
</script>
<style lang="scss">
  .hightColor{
    color: #409EFF;
  }
</style>
