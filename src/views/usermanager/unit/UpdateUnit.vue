<!--单位信息编辑页-->
<template>
  <div class="update-unit">
    <Modal class="update-unit-modal" v-model="modalUpdateUnitForm.show" :title="modalUpdateUnitForm.title" width="640px" ok-text="修改" @on-ok="updateUnitInfo">
      <div>
        <Form ref="formValidate" :model="updateUnitFormData" :label-width="90" label-position="left" :rules="ruleValidate">
          <Row :gutter="24">
            <i-col span="12">
              <FormItem label="单位名称" prop="unitName">
                <Input type="text" clearable v-model="updateUnitFormData.unitName" placeholder="请以输入单位名称" />
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="单位简称" prop="abbrName">
                <Input type="text" clearable v-model="updateUnitFormData.abbrName" placeholder="请以输入单位简称" />
              </FormItem>
            </i-col>
          </Row>
          <Row :gutter="24">
            <i-col span="12">
              <FormItem label="单位地址" prop="address">
                <Input type="text" clearable v-model="updateUnitFormData.address" />
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="单位代码" prop="unitCode">
                <Input type="text" clearable v-model="updateUnitFormData.unitCode" />
              </FormItem>
            </i-col>
          </Row>
          <Row :gutter="24">
            <i-col span="12">
              <FormItem label="负责人" prop="relaPerson">
                <Input type="text" clearable v-model="updateUnitFormData.relaPerson" />
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="负责人电话" prop="relaTel">
                <Input type="text" clearable v-model="updateUnitFormData.relaTel" />
              </FormItem>
            </i-col>
          </Row>
          <Row :gutter="24">
            <i-col span="24">
              <FormItem label="描述" prop="remarks">
                <Input type="textarea" clearable v-model="updateUnitFormData.remarks" :autosize="{ minRows: 4, maxRows: 8 }" />
              </FormItem>
            </i-col>
          </Row>
        </Form>
      </div>
    </Modal>
    <Modal class-name="updateunit-modal-err" v-model="modalError.show" :title="modalError.title" width="416px">
      <p>{{ modalError.content }}</p>
    </Modal>
  </div>
</template>
<script>
const validatePhone = (rule, value, callback) => {
  if (!/^1[34578]\d{9}$/.test(value)) {
    callback("手机号格式不正确");
  } else {
    callback();
  }
};
export default {
  name: "UpdateUnit",
  props: ["modalUpdateUnitForm", "updateUnitFormData"],
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
  methods: {
    isEmpty(obj) {
      if (typeof obj == "undefined" || obj == null || obj == "") {
        return true;
      } else {
        return false;
      }
    },
    updateUnitInfo() {
      if (this.isEmpty(this.updateUnitFormData.unitName) && this.isEmpty(this.updateUnitFormData.abbrName)) {
        this.$Message.info("单位名称和单位简称必填且不能为空！");
      } else {
        this.$http
          .put("/api/users/unit", this.updateUnitFormData)
          .then(suc => {
            if (suc.data.success) {
              this.$parent.getUnitInfoList();
              this.$Message.info("修改单位信息成功！");
              return;
            }
            throw new Error(suc.data.message);
          })
          .catch(err => {
            console.log(err);
            this.modalError = {
              show: true,
              title: "单位信息修改失败！",
              content: `${err}`
            };
          });
      }
    }
  }
};
</script>
<style>
.updateunit-modal-err .ivu-modal-header,
.updateunit-modal-err .ivu-modal-foote,
.update-unit-modal .ivu-modal-header,
.update-unit-modal .ivu-modal-footer {
  border: none;
}
</style>
