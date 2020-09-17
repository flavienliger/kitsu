<template>
  <div class="side-column project-arbo">
    <ul>
      <template v-for="(group, k) in sequences">
        <li :key="k">
          <chevron-down-icon
            v-if="openedSequences[k].show"
            v-on:click="showShots(k, group)"
            size="1.4x"
            class="chevron">
          </chevron-down-icon>
          <chevron-right-icon
            v-else
            v-on:click="showShots(k, group)"
            size="1.4x"
            class="chevron">
          </chevron-right-icon>
          <span v-on:click="openElement(group)">{{ group.name }}</span>
        </li>
        <ul :key="k+'a'" v-show="openedSequences[k].show">
          <li :key="i" v-for="(shot, i) in shotsBySequence(group.id)">
            <span v-on:click="openElement(shot)">{{ shot.name }}</span>
          </li>
        </ul>
      </template>
    </ul>
  </div>
</template>

<script>
import { ChevronRightIcon, ChevronDownIcon } from 'vue-feather-icons'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'project-arbo',

  props: {
    sequences: {
      type: Array,
      default: () => []
    }
  },

  components: {
    ChevronRightIcon, ChevronDownIcon
  },

  data () {
    return {
      openedSequences: [{ show: false }]
    }
  },

  computed: {
    ...mapGetters([
      'shotsBySequence'
    ])
  },

  methods: {
    ...mapActions([
      'loadShots'
    ]),
    showShots (idx, sequence) {
      // test to replace openedSequence by sequences directly
      this.openedSequences[idx].show = !this.openedSequences[idx].show
      this.loadShots(sequence.id)
    },
    loadShots (seqId) {
      const shots = this.shotsBySequence(seqId)
      if (shots.length === 0) {
        this.$store.dispatch('loadShotsBySequence', seqId)
      }
    },
    openElement (el) {
      const input = document.querySelector('.search-input')
      input.value = el.name
      input.dispatchEvent(new Event('input'))
    }
  },

  watch: {
    sequences () {
      this.openedSequences = []
      for (let i = 0; i < this.sequences.length; i++) {
        this.openedSequences.push({ show: false })
      }
    }
  }
}

</script>

<style lang="scss" scoped>
.side-column {
  width: 200px;
}

li {
  list-style: none;
  cursor: pointer;
  padding: 2px;
  user-select: none;
}

li > span {
  vertical-align: text-bottom;
}

.project-arbo {
  padding: 10px;
  border-right: 1px solid #b5b5b5;
  resize: horizontal;
  overflow: auto;
}

.chevron {
  margin: 2px;
  margin-bottom: -4px;
}

</style>
