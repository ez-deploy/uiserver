<template>
  <div>
    <t-row 
      class="project-name-and-operations-holder"
      align="middle"
    >
      <h1 class="my-projects-title">
        <a :href="'/ui/project/show/' + project_info.id">
          {{project_info.name}}
        </a>/<a :href="'/ui/service/show/' + service_info.id + '/info'">
          {{service_info.name}}
        </a>/<a>Versions</a>
      </h1>

      <t-button 
        size="large"
        shape="round"
        @click="dialogVisible = true"
      >
        Create New
        <file-add-icon/>
      </t-button>
    </t-row>
    <t-table
      rowKey="id"
      class="version-table"
      :data="version_infos"
      :columns="table_cols"
      stripe
      bordered
      hover
      size="medium"
      table-layout="auto"
    ></t-table>
    <t-dialog
      :visible="dialogVisible"
      :header="'Create New Version for ' + service_info.name"
      :onClose="() => {dialogVisible = false}"
      :onOpened="() => {
        create_version_info.name = create_version_info.description = create_version_info.image = ''
        create_version_info.container_port = 80
      }"
    >
      <template #title>
        <h1>Create New Project</h1>
      </template>
      <t-divider></t-divider>
      <label
        class="label"
      >
        Version Name
      </label>
      <t-input
        class="create-project-input"
        v-model="create_version_info.name"
        placeholder=""
        :rules="[{ required: true, message: 'Please input project name' }]"
      />
      
      <label
        class="label"
      >
        Version Description
      </label>
      <t-input
        class="create-project-input"
        v-model="create_version_info.description"
        placeholder=""
        :rules="[{ required: true, message: 'Please input project description' }]"
      />

      <label
        class="label"
      >
        Docker Image URL
      </label>
      <t-input
        class="create-project-input"
        v-model="create_version_info.image"
        placeholder=""
        :rules="[{ required: true, message: 'Please input project description' }]"
      />

      <label
        class="label"
      >
        ContainerPort
      </label>
      <t-input
        class="create-project-input"
        v-model="create_version_info.container_port"
        placeholder=""
        :rules="[{ required: true, message: 'Please input project description' }]"
      />

      <template #footer>
        <t-button
          size="large"
          shape="round"
          @click="createVersion"
        >
          Create
        </t-button>
      </template>
    </t-dialog>
  </div>
</template>
<script>
import { MessagePlugin } from 'tdesign-vue'
import {FileAddIcon} from 'tdesign-icons-vue';

let table_cols = [
  {
    width: '100',
    colKey: 'id',
    title: 'id',
    align: 'center',
    attrs: {
      'data-id': 'first-column',
    },
  },
  {
    width: 100,
    colKey: 'name',
    title: 'name',
  },
  {
    colKey: 'description',
    title: 'description',
  },
  {
    colKey: 'image',
    title: 'image',
  },
  {
    colKey: 'container_port',
    title: 'port'
  },
  {
    colKey: 'create_at',
    title: 'create_at',
  },
]
export default {
  name: "service-version",
  components: {
    FileAddIcon,
  },
  data() {
    return {
      current_version_info: {
        id: 0
      },
      version_infos: [],
      project_info: {
        id: 0,
        name: '',
        description: ''
      },
      service_info: {
        id: 0,
        name: '',
        description: ''
      },
      table_cols: table_cols,
      dialogVisible: false,
      create_version_info: {
        name: '',
        description: '',
        image: '',
        container_port: 80,
      },
    }
  },
  created() {
    this.set_service_info()
    this.set_version_infos()
  },
  methods: {
    createVersion() {
      let _this = this

      let callback = function (err, data, resp) {
        if (err) {
          MessagePlugin.error("create version info error" + err)
        } else {
          MessagePlugin.success("create version info success")
          _this.set_service_info()
          _this.set_version_infos()
          _this.dialogVisible = false
        }
      }
      
      this.create_version_info.service_id = this.service_info.id
      this.create_version_info.container_port = Number(this.create_version_info.container_port)
      this.$serviceClient.createServiceVersion(this.create_version_info, callback)
    },
    set_version_infos() {
      let _this = this

      let callback = function (err, data, resp) {
        if (err) {
          MessagePlugin.error("fetch version infos error " + err)
        } else {
          _this.version_infos = data.versions
          for (let version of _this.version_infos) {
            let date_info = new Date(version.create_at)
            version.create_at = date_info.toLocaleDateString().replace(/\//g, "-") + " " + date_info.toTimeString().substr(0, 8)
          }

          _this.version_infos = _this.version_infos.reverse()
        }
      }

      this.$serviceClient.listServiceVersion(this.$route.params.id, callback);
    },
    set_service_info() {
      let _this = this

      let callback = function (err, data, resp) {
        if (err) {
          MessagePlugin.error("get service info error " + err)
          _this.$router.push("/ui/project/list")
        } else if (data.services === undefined || data.services.length === 0) {
          MessagePlugin.error("service info not found")
          _this.$router.push("/ui/project/list")
        } else {
          let svc = _this.service_info
          svc = data.services[0]
          svc.running = (svc.running === undefined) ? false : svc.running
          svc.replica = (svc.replica === undefined) ? 0 : svc.replica
          svc.expose_type = (svc.expose_type === undefined) ? "none" : svc.expose_type
          svc.in_cluster_port = (svc.in_cluster_port === undefined) ? 80 : svc.in_cluster_port
          svc.node_port = (svc.node_port === undefined) ? 30010 : svc.node_port
          svc.version_id = (svc.version_id === undefined) ? 0 : svc.version_id

          // write back
          _this.service_info = svc 

          _this.set_project_info(svc.project_id)
          _this.set_current_version_info(svc.version_id)
        }
      }

      let svc_id = this.$route.params.id
      var opts = { 
        'serviceId': svc_id,
      };

      this.$serviceClient.listService(opts, callback)
    },
    set_project_info(project_id) {
      let _this = this;

      let callback = function (err, data, resp) {
        if (err) {
          MessagePlugin.error("get project info error " + err)
          _this.$router.push("/ui/project/list")
        } else {
          _this.project_info = data
        }
      }
      
      this.$projectClient.getProject(project_id, callback)
    },
    set_current_version_info(version_id) {
      // no current version info.
      if (version_id === 0) {
        MessagePlugin.info("no selected version, select in release page")
        return
      }

      let _this = this
      let callback = function (err, data, resp) {
        if (err) {
          MessagePlugin.error("get current version info error" + err)
        } else {
          _this.current_version_info = data
        }
      }

      this.$serviceClient.getServiceVersion(this.service_info.id, version_id, callback)
    }
  }
}
</script>

<style>

.version-table {
  left: 24px;
  width: calc(100% - 48px);
}

.info-card {
  left: 18px;
  width: 800px;
  margin-bottom: 2vh;
}

.project-page-holder {
  min-height: calc(100vh - 64px);
}

.my-projects-title {
  margin-left: 36px;
  margin-right: 18px;
}

.project-name-and-operations-holder {
  margin-top: 2vh;
  width: 100%;
}

.project-card-flex-holder {
  margin-bottom: 1vh;
  margin-left: 1vw;
  margin-right: 1vw;
  max-width: 100%;
  display: flex;
  flex-direction: row;
  align-content: flex-end;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
}

.project-card {
  width: 23.5vw;
  height: 15vh;

  margin-bottom: 1vh;
  margin-top: 1vh;
}

.project-name {
  font-size: 1vw;
  font-weight: bold;
}

.project-description {
  font-size: 0.7vw;
}


.label {
  display: block;
  margin-bottom: 8px;
  font-weight: 400;
  text-align: left;
  line-height: 1.5;
  font-size: 14px;
}

.create-project-input {
  margin-bottom: 12px;
}

.status-font {
  font-size: 1.3vh;
}

.status-icon {
  width: 1.4vh;
  height: 1.4vh;
}

.stop-color {
  color: lightcoral;
}


.description {
  color: gray;
}
</style>