<template>
<div :class="{
  'modal': true,
  'is-active': active
}">
  <div class="modal-background" @click="$emit('cancel')" ></div>

  <div class="modal-content">
    <div class="box">
      <h1 class="title" v-if="productionToEdit && productionToEdit.id">
        {{ $t("productions.edit_title") }} {{ productionToEdit.name }}
      </h1>
      <h1 class="title" v-else>
        {{ $t("productions.new_production") }}
      </h1>

      <form v-on:submit.prevent>
        <text-field
          ref="nameField"
          :label="$t('productions.fields.name')"
          v-model="form.name"
          @enter="runConfirmation"
          v-focus
        />
        <combobox v-if="productionToEdit && productionToEdit.id"
          :label="$t('productions.fields.status')"
          :options="productionStatusOptions"
          localeKeyPrefix="productions.status."
          @enter="runConfirmation"
          v-model="form.project_status_id"
        />
        <combobox
          :label="$t('productions.fields.type')"
          :options="productionTypeOptions"
          localeKeyPrefix="productions.type."
          @enter="runConfirmation"
          v-model="form.production_type"
        />
        <text-field v-if="productionToEdit && productionToEdit.id"
          ref="fpsField"
          :label="$t('productions.fields.fps')"
          v-model="form.fps"
          @enter="runConfirmation"
          v-focus
        />
        <text-field v-if="productionToEdit && productionToEdit.id"
          ref="ratioField"
          :label="$t('productions.fields.ratio')"
          v-model="form.ratio"
          @enter="runConfirmation"
          v-focus
        />
        <text-field v-if="productionToEdit && productionToEdit.id"
          ref="resolutionField"
          :label="$t('productions.fields.resolution')"
          v-model="form.resolution"
          @enter="runConfirmation"
          v-focus
        />
        <text-field v-if="productionToEdit && productionToEdit.id"
          ref="exportNameField"
          :label="$t('productions.fields.export_name')"
          v-model="form.export_name"
          @enter="runConfirmation"
          v-focus
        />
        <combobox
          :label="$t('productions.fields.colorspace')"
          :options="productionColorspaceOptions"
          @enter="runConfirmation"
          v-model="form.colorspace"
        />
        <text-field v-if="productionToEdit && productionToEdit.id"
          ref="supervisorField"
          :label="$t('productions.fields.supervisor')"
          v-model="form.supervisor"
          @enter="runConfirmation"
          v-focus
        />
        <div v-if="productionToEdit && productionToEdit.id">
          <span class="label">{{ $t("productions.picture") }}</span>
          <file-upload
            ref="fileField"
            :label="$t('main.csv.upload_file')"
            accept=".png,.jpg,.jpeg"
            @fileselected="onFileSelected"
          />
        </div>
      </form>

      <modal-footer
        :error-text="$t('productions.edit_error')"
        :is-error="isError"
        :is-loading="isLoading"
        @confirm="runConfirmation"
        @cancel="$emit('cancel')"
      />

    </div>
  </div>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { modalMixin } from './base_modal'

import Combobox from '../widgets/Combobox'
import ModalFooter from '@/components/modals/ModalFooter'
import FileUpload from '../widgets/FileUpload'
import TextField from '../widgets/TextField'

export default {
  name: 'edit-production-modal',
  mixins: [modalMixin],
  components: {
    Combobox,
    FileUpload,
    ModalFooter,
    TextField
  },

  props: [
    'text',
    'active',
    'isLoading',
    'isError',
    'errorText',
    'productionToEdit'
  ],

  data () {
    const data = {
      formData: null,
      productionTypeOptions: [
        {
          label: 'short',
          value: 'short'
        },
        {
          label: 'featurefilm',
          value: 'featurefilm'
        },
        {
          label: 'tvshow',
          value: 'tvshow'
        }
      ],
      productionColorspaceOptions: [
        {
          label: 'linear',
          value: 'linear'
        },
        {
          label: 'sRGB',
          value: 'sRGB'
        },
        {
          label: 'Cineon',
          value: 'Cineon'
        },
        {
          label: 'rec709',
          value: 'rec709'
        },
        {
          label: 'Gamma1.8',
          value: 'Gamme1.8'
        },
        {
          label: 'Gamma2.2',
          value: 'Gamma2.2'
        },
        {
          label: 'Gamma2.4',
          value: 'Gamma2.4'
        },
        {
          label: 'Panalog',
          value: 'Panalog'
        },
        {
          label: 'REDLog',
          value: 'REDLog'
        },
        {
          label: 'ViperLog',
          value: 'ViperLog'
        },
        {
          label: 'AlexaV3LogC',
          value: 'AlexaV3LogC'
        },
        {
          label: 'PlogLin',
          value: 'PlogLin'
        },
        {
          label: 'SLog',
          value: 'SLog'
        },
        {
          label: 'SLog1',
          value: 'SLog1'
        },
        {
          label: 'SLog2',
          value: 'SLog2'
        },
        {
          label: 'SLog3',
          value: 'SLog3'
        },
        {
          label: 'CLog',
          value: 'CLog'
        },
        {
          label: 'Protune',
          value: 'Protune'
        },
        {
          label: 'raw',
          value: 'raw'
        },
        {
          label: 'ACES - ACES2065-1',
          value: 'ACES - ACES2065-1'
        },
        {
          label: 'ACES - ACEScc',
          value: 'ACES - ACEScc'
        },
        {
          label: 'ACES - ACESproxy',
          value: 'ACES - ACESproxy'
        },
        {
          label: 'ACES - ACEScg',
          value: 'ACES - ACEScg'
        },
        {
          label: 'Input - ADX - ADX10',
          value: 'Input - ADX - ADX10'
        }
      ]
    }

    if (this.productionToEdit && this.productionToEdit.id) {
      data.form = {
        name: this.productionToEdit.name,
        project_status_id: this.productionToEdit.project_status_id,
        fps: this.productionToEdit.fps,
        ratio: this.productionToEdit.ratio,
        resolution: this.productionToEdit.resolution,
        production_type: this.productionToEdit.production_type || 'short'
      }
    } else {
      data.form = {
        name: '',
        project_status_id: this.productionStatus ? this.productionStatus[0].id : null,
        fps: '',
        ratio: '',
        resolution: '',
        production_type: 'short'
      }
    }

    return data
  },

  created () {
    this.resetForm()

    this.productionTypeOptions = [
      {
        label: 'short',
        value: 'short'
      },
      {
        label: 'featurefilm',
        value: 'featurefilm'
      },
      {
        label: 'tvshow',
        value: 'tvshow'
      }
    ]
  },

  mounted () {
    if (this.productionStatus.length > 0) {
      this.form.project_status_id = this.productionStatus[0].id
    }
  },

  computed: {
    ...mapGetters([
      'productions',
      'productionStatus',
      'productionStatusOptions'
    ])
  },

  methods: {
    ...mapActions([
    ]),

    runConfirmation () {
      this.$emit('confirm', this.form)
    },

    onFileSelected (formData) {
      this.formData = formData
      this.$emit('fileselected', formData)
    },

    resetForm () {
      if (this.productionToEdit && this.productionToEdit.id) {
        this.form = {
          name: this.productionToEdit.name,
          project_status_id: this.productionToEdit.project_status_id,
          fps: this.productionToEdit.fps,
          ratio: this.productionToEdit.ratio,
          resolution: this.productionToEdit.resolution,
          production_type: this.productionToEdit.production_type || 'short'
        }
        this.form.project_status_id = null
        this.$nextTick(() => {
          this.form.project_status_id = this.productionToEdit.project_status_id
        })
      } else {
        this.form = {
          name: '',
          project_status_id: this.productionStatusOptions[0].value,
          fps: '',
          ratio: '',
          resolution: '',
          production_type: 'short'
        }
      }
    }
  },

  watch: {
    productionToEdit () {
      this.resetForm()
    },

    active () {
      if (this.active) {
        setTimeout(() => {
          this.$refs.nameField.focus()
          this.formData = null
          if (this.$refs.fileField) this.$refs.fileField.reset()
        }, 100)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  padding-bottom: 1.5em;
}
</style>
