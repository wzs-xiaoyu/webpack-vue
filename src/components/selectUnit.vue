<template>
  <div class="select-unit">
    <treeselect v-if="isdisable == 'true'" noOptionsText="暂无数据" v-model="unitId" :multiple="false" disabled :options="options" :placeholder="placeholder" :max-height="200" @select="selectedUnit" />
    <treeselect v-else v-model="unitId" noOptionsText="暂无数据" :multiple="false" :options="options" :placeholder="placeholder" :max-height="200" @select="selectedUnit" />
  </div>
</template>
<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "SelectUnit",
  components: {
    Treeselect
  },
  props: {
    placeholder: {
      type: String,
      required: false,
      default: "请选择"
    },
    prefix: {
      type: String,
      required: false,
      default: ""
    },
    selecteddata: {
      type: String,
      required: false,
      default: ""
    },
    isdisable: {
      type: String,
      required: false,
      default: "false"
    }
  },
  data() {
    return {
      options: [],
      unitId: this.selecteddata
    };
  },
  watch: {
    selecteddata(value) {
      this.unitId = value;
    },
    unitArr(value) {
      this.unitArr = value;
    }
  },
  methods: {
    getUnitInfoList() {
      this.$http
        .get("/api/users/unit")
        .then(suc => {
          if (suc.data.success) {
            this.options = this.getTreeSelectData(suc.data.data);
          } else {
            this.$Message.error(suc.data.message);
            throw new Error(suc.data.message);
          }
        })
        .catch(err => {
          console.error("请求单位信息列表", err);
        });
    },

    getTreeSelectData(data) {
      let arr = [];
      if (!data.length) {
        return this.recursiveSpanningTree(arr, "-1");
      }
      data.map(item => {
        arr.push({
          label: item.unitName,
          id: item._id,
          parentId: item.parentId
        });
      });
      return this.recursiveSpanningTree(arr, "-1");
    },
    //递归生成树
    recursiveSpanningTree(data, pid) {
      var result = [],
        temp;
      if (!data.length) {
        return result;
      }
      for (var i in data) {
        if (data[i].parentId == pid) {
          result.push(data[i]);
          temp = this.recursiveSpanningTree(data, data[i].id);
          if (temp.length > 0) {
            data[i].children = temp;
          }
        }
      }
      return result;
    },
    selectedUnit(unit) {
      this.$emit("select-unit", unit.id);
    }
  }
};
</script>
<style></style>
