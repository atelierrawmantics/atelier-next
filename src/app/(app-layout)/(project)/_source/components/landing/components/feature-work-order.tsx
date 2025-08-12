import FeatureLayout from './components/feature-layout'

const FeatureWorkOrder = () => {
  return (
    <section>
      <FeatureLayout
        badgeText={'첫 번째'}
        title={`쉽고 정확한 작업지시서\n작성과 공유`}
        description={`누구나 이해할 수 있게 작업지시서를 구조화해보세요.\n오류와 누락 없이 정확하게 전달됩니다.`}
        bgUrl={"bg-[url('/images/landing/section3_1_content.png')]"}
        bgColor={
          'bg-[linear-gradient(220deg,#F1DDE0_-3.82%,rgba(249,228,166,0.15)_102.79%)]'
        }
      />
    </section>
  )
}

export default FeatureWorkOrder
