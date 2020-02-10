<!--单位新增页-->
<template>
  <div class="add-unit">
    <Modal class="add-unit-modal" v-model="modalAddUnitForm.show" :title="modalAddUnitForm.title" width="640px" ok-text="保存" @on-ok="addUnitInfo" @on-visible-change="modalVisibleChange">
      <div>
        <Form ref="formValidate" :model="addUnitFormData" :label-width="90" label-position="left" :rules="ruleValidate">
          <Row :gutter="24">
            <i-col span="12">
              <FormItem label="单位名称" prop="unitName">
                <Input type="text" clearable v-model="addUnitFormData.unitName" placeholder="请以输入单位名称" />
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="单位简称" prop="abbrName">
                <Input type="text" clearable v-model="addUnitFormData.abbrName" placeholder="请以输入单位简称" />
              </FormItem>
            </i-col>
          </Row>
          <Row :gutter="24">
            <i-col span="12">
              <FormItem label="单位地址" prop="address">
                <Input type="text" clearable v-model="addUnitFormData.address" />
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="单位代码" prop="unitCode">
                <Input type="text" clearable v-model="addUnitFormData.unitCode" />
              </FormItem>
            </i-col>
          </Row>
          <Row :gutter="24">
            <i-col span="12">
              <FormItem label="负责人" prop="relaPerson">
                <Input type="text" clearable v-model="addUnitFormData.relaPerson" />
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="负责人电话" prop="relaTel">
                <Input type="text" clearable v-model="addUnitFormData.relaTel" />
              </FormItem>
            </i-col>
          </Row>
          <Row :gutter="24">
            <i-col span="24">
              <FormItem label="描述" prop="remarks">
                <Input type="textarea" clearable v-model="addUnitFormData.remarks" :autosize="{ minRows: 4, maxRows: 8 }" />
              </FormItem>
            </i-col>
          </Row>
        </Form>
      </div>
    </Modal>
    <Modal class-name="addunit-modal-err" v-model="modalError.show" :title="modalError.title" width="416px">
      <p>{{ modalError.content }}</p>
    </Modal>
  </div>
</template>
<script>
const validatePhone = (rule, value, callback) => {
  if (!/^([0-9]{3,4}-)?[0-9]{7,8}$/.test(value)) {
    callback("手机号格式不正确");
  } else {
    callback();
  }
};
export default {
  name: "AddUnit",
  props: ["modalAddUnitForm", "parentId", "isLeaf"],
  data() {
    return {
      modalError: {
        show: false,
        title: "",
        content: ""
      },
      ruleValidate: {
        unitName: [{ required: true, message: "单位名称必填" }],
        abbrName: [{ required: true, message: "单位简称必填" }],
        relaTel: [{ required: false, validator: validatePhone }]
      }
    };
  },
  computed: {
    addUnitFormData() {
      return {
        unitName: "",
        abbrName: "",
        address: "",
        unitCode: "",
        relaPerson: "",
        relaTel: "",
        remarks: "",
        isLeaf: this.isLeaf,
        parentId: this.parentId
      };
    }
  },
  methods: {
    isEmpty(obj) {
      if (typeof obj == "undefined" || obj == null || obj == "") {
        return true;
      } else {
        return false;
      }
    },
    addUnitInfo() {
      if (this.isEmpty(this.addUnitFormData.unitName) || this.isEmpty(this.addUnitFormData.abbrName)) {
        this.$Message.info("单位名称和单位简称必填且不能为空！");
      } else {
        let UnitInfo = { ...this.addUnitFormData };
        this.$http
          .post("/api/users/unit", UnitInfo)
          .then(suc => {
            if (suc.data.success) {
              this.$parent.unitList.unshift({ name: this.addUnitFormData.unitName });
              this.$Message.info("新增单位成功！");
              this.$parent.getUnitInfoList();
              return;
            }
            throw new Error(suc.data.message);
          })
          .catch(err => {
            this.modalError = {
              show: true,
              title: "新增单位失败！",
              content: `${err}`
            };
          });
      }
    },
    //清空From表单值及验证
    modalVisibleChange() {
      this.$refs.formValidate.resetFields();
    }
  }
};
</script>
<style>
.addunit-modal-err .ivu-modal-header,
.addunit-modal-err .ivu-modal-foote,
.add-unit-modal .ivu-modal-header,
.add-unit-modal .ivu-modal-footer {
  border: none;
}
</style>
