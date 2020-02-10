<template>
  <div class="select-unit">
    <Select v-if="isdisable == 'true'" disabled :placeholder="placeholder" prefix="prefix" v-model="unitId" @on-change="selectedUnit" filterable>
      <Option v-for="item in unitArr" :value="item._id" :key="item._id">{{ item.unitName }}</Option>
    </Select>
    <Select v-else :placeholder="placeholder" prefix="prefix" v-model="unitId" @on-change="selectedUnit" filterable>
      <Option v-for="item in unitArr" :value="item._id" :key="item._id">{{ item.unitName }}</Option>
    </Select>
  </div>
</template>
<script>
export default {
  name: "SelectUnit",
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
      unitArr: [],
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
            this.unitArr = suc.data.data;
          } else {
            this.$Message.error(suc.data.message);
            throw new Error(suc.data.message);
          }
        })
        .catch(err => {
          console.error("请求单位信息列表", err);
        });
    },
    selectedUnit(unit) {
      this.$emit("select-unit", unit);
    }
  }
  // mounted() {
  //   this.getUnitInfoList();
  // }
};
</script>
<style></style>
