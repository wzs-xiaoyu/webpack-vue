<template>
  <div class="cdc">
    <div class="cdc-menu">
      <cdcMenu></cdcMenu>
    </div>
    <div class="cdc-content">
      <div class="cdc-content-action">
        <cdcForm ref="action"></cdcForm>
      </div>
      <div>
        <Table border ref="selection" :columns="tableTitle" :data="tableData"></Table>
      </div>
    </div>
  </div>
</template>

<script>
import cdcMenu from "./cdcMenu.vue";
import cdcForm from "./cdcForm.vue";
import { mapGetters, mapState, mapMutations } from "./storeCdc.js";
import { error } from "util";
export default {
  components: {
    cdcMenu,
    cdcForm
  },
  props: {},
  data() {
    return {
      tableTitle: [
        // {
        //   title: "操作",
        //   key: "action",
        //   width: 100,
        //   align: "center",
        //   render: (h, params) => {
        //     return (
        //       <div class="table-action">
        //         <Icon
        //           type="md-settings"
        //           onclick={() => {
        //             this.serverEidt(params);
        //           }}
        //         />
        //         <Icon
        //           type="ios-trash"
        //           onclick={() => {
        //             this.serverDelete(params);
        //           }}
        //         />
        //       </div>
        //     );
        //   }
        // },
        {
          title: "服务名称",
          key: "name",
          maxWidth: 180,
          align: "center"
        },
        {
          title: "状态",
          key: "action",
          width: 100,
          align: "center",
          filters: [
            {
              label: "启用",
              value: 1
            },
            {
              label: "停用",
              value: 0
            }
          ],
          filterMultiple: false,
          filterMethod(value, row) {
            if (value === 1) {
              return !row.isStop;
            } else if (value === 0) {
              return row.isStop;
            }
            return true;
          },
          render: (h, params) => {
            return (
              <div class="table-action">
                <i-switch
                  true-value={false}
                  false-value={true}
                  size="large"
                  onOn-change={val => {
                    this.serverSwitch(val, params);
                  }}
                  vModel={params.row.isStop}
                  loading={params.row.loading}
                >
                  <span slot="open">启用</span>
                  <span slot="close">停用</span>
                </i-switch>
              </div>
            );
          }
        },
        {
          title: "接口",
          tooltip: true,
          render: (h, params) => {
            return (
              <a href={params.row.url} target="blank">
                {params.row.url}
              </a>
            );
          }
        }
      ],
      data1: []
    };
  },
  computed: {
    ...mapState(["projectNameSelected"]),
    ...mapGetters(["curProjectServerData"]),
    tableData() {
      return this.curProjectServerData.map(item => ({ ...item, loading: false }));
    }
  },
  watch: {},
  methods: {
    ...mapMutations(["serverStatusSwitch"]),
    // 服务开启关闭
    serverSwitch(val, params) {
      params.row.loading = true;
      let postData = {
        prjName: this.projectNameSelected,
        serverName: params.row.name,
        isStop: val
      };
      this.$http
        .post("/api/CDC/isStop", postData)
        .then(suc => {
          if (!suc.data.success) throw new Error(suc.data.message);
          this.serverStatusSwitch({ index: params.index, isStop: val });
          params.row.loading = false;
        })
        .catch(err => {
          params.row.loading = false;
          params.row.isStop = !params.row.isStop;
          console.error(err);
        });
    },
    // 服务编辑
    serverEidt(params) {
      this.$refs.action.form("formEdit", params.row);
    },
    // 服务删除
    serverDelete(params) {
      this.$refs.action.form("formDelete", params.row);
    }
  },
  created() {},
  mounted() {},
  beforeDestroy() {}
};
</script>

<style>
.cdc .table-action .ivu-icon {
  margin-right: 10px;
  font-size: 1.8em;
  color: #2d8cf0;
  cursor: pointer;
}
.cdc .table-action .ivu-icon:hover {
  transform: scale(1.3);
}
</style>

<style scoped>
.cdc {
  display: flex;
  height: 100%;
  overflow: auto;
}
.cdc-menu {
  background: #515a6e;
}
.cdc-content {
  flex-grow: 1;
  overflow: auto;
  background: #f8f8f8;
  margin: 0.1rem;
  padding: 0.2rem;
  border: 1px solid #eee;
}
.cdc-content-action {
  margin-bottom: 0.1rem;
}
</style>
