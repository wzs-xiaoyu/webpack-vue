<!--角色权限编辑页-->
<template>
  <div class="edit-competence">
    <Modal class="edit-competence-modal" @on-visible-change="modalVisibleChange" v-model="modalRoleCompetenceForm.show" :title="modalRoleCompetenceForm.title" width="346px" ok-text="保存" @on-ok="updateRoleCompetence">
      <div class="competence-tree">
        <Tree :data="treeData" show-checkbox @on-check-change="checkChange"></Tree>
      </div>
    </Modal>
    <Modal class-name="editcompetence-modal-err" v-model="modalError.show" :title="modalError.title" width="416px">
      <p>{{ modalError.content }}</p>
    </Modal>
  </div>
</template>
<script>
export default {
  name: "EditCompetence",
  props: ["modalRoleCompetenceForm", "roleCompetence"],
  data() {
    return {
      modalError: {
        show: false,
        title: "",
        content: ""
      },
      treeData: [],
      powerIds: []
    };
  },
  methods: {
    updateRoleCompetence() {
      let obj = {
        _id: this.roleCompetence._id,
        powerIds: this.powerIds
      };
      this.$http
        .put("/api/users/role/Power", obj)
        .then(suc => {
          if (suc.data.success) {
            this.$Message.info("角色权限设置成功！");
            this.getRoleCompetenceList();
            return;
          }
          throw new Error(suc.data.message);
        })
        .catch(err => {
          this.modalError = {
            show: true,
            title: "角色权限设置失败！",
            content: `${err}`
          };
        });
    },
    getRoleCompetenceList(roleId) {
      let params = {
        _id: roleId
      };
      this.$http
        .get("/api/users/role/power", { params: params })
        .then(suc => {
          this.treeData = this.getTreeDataFormat(suc.data.data);
        })
        .catch(err => {
          console.error("请求权限信息列表", err);
        });
    },
    getTreeDataFormat(data) {
      return this.recursiveSpanningTree(this.getTreeDataStructure(data), "-1");
    },
    //获取树的数据结构
    getTreeDataStructure(arr) {
      let data = [];
      if (arr.length == 0) {
        return;
      } else {
        arr.map(item => {
          data.push({
            title: item.funcName,
            expand: true,
            id: item._id,
            checked: item.isPower ? true : false,
            parentId: item.parentId,
            isPower: item.isPower,
            render: (h, { data }) => {
              return h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "100%"
                  }
                },
                [
                  h("span", [
                    h("Icon", {
                      props: {
                        type: data.parentId == "-1" ? "ios-folder" : "ios-paper"
                      },
                      style: {
                        marginRight: "0.1rem",
                        fontSize: "14px"
                      }
                    }),
                    h("span", data.title)
                  ])
                ]
              );
            }
          });
        });
      }
      return data;
    },
    //递归生成树
    recursiveSpanningTree(data, pid) {
      var result = [],
        temp;
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
    //清空每次编辑选中值
    modalVisibleChange() {
      this.powerIds = [];
    },
    checkChange(checkArr) {
      for (var i in checkArr) {
        this.powerIds.push(checkArr[i].id);
      }
    }
  }
};
</script>
<style>
.editcompetence-modal-err .ivu-modal-header,
.editcompetence-modal-err .ivu-modal-foote,
.edit-competence-modal .ivu-modal-header,
.edit-competence-modal .ivu-modal-footer {
  border: none;
}
.competence-tree {
  margin-left: 12px;
}
</style>
